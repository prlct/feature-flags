import Joi from 'joi';

import config from 'config';
import { authService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { adminService } from 'resources/admin';

const schema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Token is required',
      'string.empty': 'Token is required',
    }),
});

type ValidatedData = {
  token: string;
  adminId: string;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const admin = await adminService.findOne({ signupToken: ctx.validatedData.token });

  ctx.assertClientError(admin, { token: 'Token is invalid' }, 404);

  ctx.validatedData.adminId = admin._id;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { adminId } = ctx.validatedData;

  await Promise.all([
    adminService.updateOne({ _id: adminId }, () => ({
      isEmailVerified: true,
      signupToken: null,
    })),
    adminService.updateLastRequest(adminId),
    authService.setTokens(ctx, adminId),
  ]);

  ctx.redirect(config.webUrl);
}

export default (router: AppRouter) => {
  router.get('/verify-email', validateMiddleware(schema), validator, handler);
};
