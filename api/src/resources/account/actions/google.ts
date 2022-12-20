import { Next } from 'koa';
import config from 'config';
import { googleService, amplitudeService } from 'services';
import { AppRouter, AppKoaContext } from 'types';
import { adminService } from 'resources/admin';

import createAdmin from '../middlewares/admin-creation.middleware';

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

const signinGoogleWithCode = async (ctx: AppKoaContext, next: Next) => {
  const { code } = ctx.request.query;

  const { isValid, payload } = await googleService.
    exchangeCodeForToken(code as string) as { isValid: boolean, payload: ValidatedData };

  ctx.assertError(isValid, `Exchange code for token error: ${payload}`);

  const  admin = await adminService.findOne({ email: payload.email });

  if (admin) {
    ctx.state.admin = {
      ...admin,
      isEmailVerified: true,
      oauth: {
        google: true,
      },
    };
    amplitudeService.trackEvent(admin._id, 'Admin sign in', { method: 'google' });
  } else {
    ctx.state.authAdminData = {
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      isEmailVerified: true,
      oauth: {
        google: true,
      },
    };
  }

  await next();

  ctx.redirect(config.webUrl);
};



export default (router: AppRouter) => {
  router.get('/sign-in/google/auth', getOAuthUrl);
  router.get('/sign-in/google', signinGoogleWithCode, createAdmin);
};
