import Joi from 'joi';

import { securityUtil } from 'utils';
import { emailService } from 'services';
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
});

type ValidatedData = {
  email: string;
  admin: Admin;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;

  const admin = await adminService.findOne({ email });

  if (!admin) return ctx.body = {};

  ctx.validatedData.admin = admin;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { admin } = ctx.validatedData;

  const resetPasswordToken = await securityUtil.generateSecureToken();

  await Promise.all([
    adminService.updateOne({ _id: admin._id }, () => ({ resetPasswordToken })),
    emailService.sendForgotPassword(admin.email, {
      email: admin.email,
      resetPasswordToken,
    }),
  ]);

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/resend-email', validateMiddleware(schema), validator, handler);
};
