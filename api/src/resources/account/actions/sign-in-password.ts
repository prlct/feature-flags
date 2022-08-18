import Joi from 'joi';

import { securityUtil } from 'utils';
import { authService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { adminService, Admin } from 'resources/admin';

const schema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'any.required': 'Email is required',
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
  password: Joi.string()
    .min(6)
    .max(50)
    .required()
    .messages({
      'any.required': 'Password is required',
      'string.empty': 'Password is required',
      'string.min': 'Password must be 6-50 characters',
      'string.max': 'Password must be 6-50 characters',
    }),
});

type ValidatedData = {
  email: string;
  password: string;
  admin: Admin;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email, password } = ctx.validatedData;

  const admin = await adminService.findOne({ email });

  ctx.assertClientError(admin, {
    credentials: 'The email or password you have entered is invalid',
  }, 401);

  const isPasswordMatch = await securityUtil.compareTextWithHash(password, admin.passwordHash);
  ctx.assertClientError(isPasswordMatch, {
    credentials: 'The email or password you have entered is invalid',
  }, 401);

  ctx.assertClientError(admin.isEmailVerified, {
    email: 'Please verify your email to sign in',
  });

  ctx.validatedData.admin = admin;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { admin } = ctx.validatedData;

  await Promise.all([
    adminService.updateLastRequest(admin._id),
    authService.setTokens(ctx, admin._id),
  ]);

  ctx.body = adminService.getPublic(admin);
}

export default (router: AppRouter) => {
  router.post('/sign-in', validateMiddleware(schema), validator, handler);
};
