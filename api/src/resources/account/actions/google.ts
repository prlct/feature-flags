import config from 'config';
import { googleService, authService } from 'services';
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
  const isValidCredentials = config.google.clientId || config.google.clientSecret;
  ctx.assertClientError(isValidCredentials, {
    global: 'Setup Google Oauth credentials on API',
  });
  ctx.redirect(googleService.oAuthURL);
};

const signinGoogleWithCode = async (ctx: AppKoaContext) => {
  const { code } = ctx.request.query;

  const { isValid, payload } = await googleService.
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
    if (!admin.oauth?.google) {
      adminChanged = await adminService.updateOne(
        { _id: admin._id },
        (old) => ({ ...old, oauth: { google: true } }),
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
      isEmailVerified: true,
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
  router.get('/sign-in/google/auth', getOAuthUrl);
  router.get('/sign-in/google', signinGoogleWithCode);
};