import { Next } from 'koa';
import config from 'config';
import { githubService, amplitudeService } from 'services';
import { AppRouter, AppKoaContext } from 'types';
import { adminService } from 'resources/admin';

import createAdmin from '../middlewares/admin-creation.middleware';

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

const signinGithubWithCode = async (ctx: AppKoaContext, next: Next) => {
  const { code } = ctx.request.query;

  const {
    isValid,
    payload,
  } = await githubService.exchangeCodeForToken(code as string) as { isValid: boolean, payload: ValidatedData };

  ctx.assertError(isValid, `Exchange code for token error: ${payload}`);

  const admin = await adminService.findOne({ email: payload.email });

  if (admin) {
    ctx.state.admin = {
      ...admin,
      isEmailVerified: true,
      oauth: {
        github: true,
      },
    };
  } else {
    ctx.state.authAdminData = {
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      isEmailVerified: true,
      oauth: {
        github: true,
      },
    };
  }
  await next();

  amplitudeService.trackEvent(ctx, admin ? 'Admin sign in' : 'Admin sign up', { method: 'github' });

  ctx.redirect(config.webUrl);
};


export default (router: AppRouter) => {
  router.get('/sign-in/github/auth', getOAuthUrl);
  router.get('/sign-in/github', signinGithubWithCode, createAdmin);
};
