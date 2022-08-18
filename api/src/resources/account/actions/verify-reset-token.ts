import Joi from 'joi';

import config from 'config';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { adminService } from 'resources/admin';

const schema = Joi.object({
  email: Joi.string()
    .required()
    .messages({
      'any.required': 'Token is required',
      'string.empty': 'Token is required',
    }),
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Token is required',
      'string.empty': 'Token is required',
    }),
});

type ValidatedData = {
  token: string;
  email: string;
};

async function validator(ctx: AppKoaContext<ValidatedData>) {
  const { email, token } = ctx.validatedData;

  const admin = await adminService.findOne({ resetPasswordToken: token });

  const redirectUrl = admin
    ? `${config.webUrl}/reset-password?token=${token}`
    : `${config.webUrl}/expire-token?email=${email}`;

  ctx.redirect(redirectUrl);
}

export default (router: AppRouter) => {
  router.get('/verify-reset-token', validateMiddleware(schema), validator);
};
