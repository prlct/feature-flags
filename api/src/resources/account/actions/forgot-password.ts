import Joi from 'joi';

import config from 'config';
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
  const admin = await adminService.findOne({ email: ctx.validatedData.email });

  if (!admin) return ctx.body = {};

  ctx.validatedData.admin = admin;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { admin } = ctx.validatedData;

  let { resetPasswordToken } = admin;

  if (!resetPasswordToken) {
    resetPasswordToken = await securityUtil.generateSecureToken();
    await adminService.updateOne({ _id: admin._id }, () => ({
      resetPasswordToken,
    }));
  }

  await emailService.sendForgotPassword(
    admin.email,
    {
      firstName: admin.firstName,
      resetPasswordUrl: `${config.apiUrl}/account/verify-reset-token?token=${resetPasswordToken}&email=${admin.email}`,
    },
  );

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/forgot-password', validateMiddleware(schema), validator, handler);
};
