import Joi from 'joi';

import { securityUtil } from 'utils';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { adminService, Admin } from 'resources/admin';

const schema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Token is required',
      'string.empty': 'Token is required',
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
  token: string;
  password: string;
  admin: Admin;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { token } = ctx.validatedData;

  const admin = await adminService.findOne({ resetPasswordToken: token });

  if (!admin) return ctx.body = {};

  ctx.validatedData.admin = admin;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { admin, password } = ctx.validatedData;

  const passwordHash = await securityUtil.getHash(password);

  await adminService.updateOne({ _id: admin._id }, () => ({
    passwordHash,
    resetPasswordToken: null,
  }));

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.put('/reset-password', validateMiddleware(schema), validator, handler);
};
