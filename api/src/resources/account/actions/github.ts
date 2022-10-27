import config from 'config';
import { authService, githubService } from 'services';
import slackService from 'services/slack.service';
import mailerLiteService from 'services/mailerlite.service';
import { AppRouter, AppKoaContext } from 'types';
import { adminService } from 'resources/admin';
import { companyService } from 'resources/company';
import { applicationService, Env } from 'resources/application';
import { securityUtil } from 'utils';
import { PRIVATE_API_KEY_SECURITY_LENGTH, PUBLIC_API_KEY_SECURITY_LENGTH } from 'app.constants';

type ValidatedData = {
  given_name: string;
  family_name: string;
  email: string;
};

const getOAuthUrl = async (ctx: AppKoaContext) => {
  const isValidCredentials = config.github.clientId || config.github.clientSecret;
  ctx.assertClientError(isValidCredentials, {
    global: 'Setup Github Oauth creadentials on API',
  });
  ctx.redirect(githubService.oAuthURL);
};

const signinGithubWithCode = async (ctx: AppKoaContext) => {
  const { code } = ctx.request.query;

  const { isValid, payload }  = await githubService.
    exchangeCodeForToken(code as string) as { isValid: boolean, payload: ValidatedData };

  ctx.assertError(isValid, `Exchange code for token error: ${payload}`);

  const  admin = await adminService.findOne({ email: payload.email });
  let adminChanged;

  const publicApiKey = 'pk_' + securityUtil.generateSecureToken(PUBLIC_API_KEY_SECURITY_LENGTH);
  const privateApiKey = 'sk_' + securityUtil.generateSecureToken(PRIVATE_API_KEY_SECURITY_LENGTH);

  const isKeysExist = await applicationService.exists({ $or: [{ publicApiKey }, { privateApiKey }] });

  ctx.assertClientError(!isKeysExist, {
    global: 'Keys generation error. Please try again',
  });

  if (admin) {
    if (!admin.oauth?.github) {
      adminChanged = await adminService.updateOne(
        { _id: admin._id },
        (old) => ({ ...old, oauth: { ...old.oauth, github: true } }),
      );
    }
    const adminUpdated = adminChanged || admin;
    await Promise.all([
      adminService.updateLastRequest(adminUpdated._id),
      authService.setTokens(ctx, adminUpdated._id),
    ]);

  } else {
    const newAdmin = await adminService.insertOne({
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
      isEmailVerified: !!payload.email,
      oauth: {
        github: true,
      },
    });

    const company = await companyService.insertOne({
      ownerId: newAdmin._id,
      applicationIds: [],
      adminIds: [newAdmin._id],
    });

    const application = await applicationService.insertOne({
      publicApiKey,
      privateApiKey,
      companyId: company._id,
      featureIds: [],
      envs: {
        [Env.DEVELOPMENT]: {
          totalUsersCount: 0,
        },
        [Env.STAGING]: {
          totalUsersCount: 0,
        },
        [Env.DEMO]: {
          totalUsersCount: 0,
        },
        [Env.PRODUCTION]: {
          totalUsersCount: 0,
        },
      },
    });

    if (newAdmin) {
      await Promise.all([
        adminService.updateLastRequest(newAdmin._id),
        authService.setTokens(ctx, newAdmin._id),
        companyService.updateOne(
          { _id: company._id },
          () => ({ applicationIds: [application._id] }),
        ),
        adminService.updateOne(
          { _id: newAdmin._id },
          () => ({
            ownCompanyId: company._id,
            companyIds: [company._id],
            applicationIds: [application._id],
          }),
        ),
      ]);
      const name = `${payload.given_name} ${payload.family_name}`.trim();

      slackService.send(`${name} just signed up! Reach out by email: ${payload.email}.`);
      mailerLiteService.addOnboardingSubscriber({ email: payload.email, name });
    }
  }
  ctx.redirect(config.webUrl);
};



export default (router: AppRouter) => {
  router.get('/sign-in/github/auth', getOAuthUrl);
  router.get('/sign-in/github', signinGithubWithCode);
};