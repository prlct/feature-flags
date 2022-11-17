import Joi from 'joi';

import config from 'config';
import { authService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { adminService, Admin } from 'resources/admin';

const schema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'any.required': 'Id is required',
    }),
});

type ValidatedData = {
  id: string;
  admin: Admin;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { id } = ctx.validatedData;

  const admin = await adminService.findOne({ _id: id });

  ctx.assertClientError(admin, {
    id: 'User does not exist',
  });

  ctx.validatedData.admin = admin;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { admin } = ctx.validatedData;

  await authService.setTokens(ctx, admin._id);

  ctx.redirect(config.webUrl);
}

export default (router: AppRouter) => {
  router.post('/shadow-login', validateMiddleware(schema), validator, handler);
};