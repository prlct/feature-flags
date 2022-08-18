import Joi from 'joi';

import { AppKoaContext, Next, AppRouter } from 'types';
import { securityUtil } from 'utils';
import { validateMiddleware } from 'middlewares';
import { adminService } from 'resources/admin';

const schema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(50)
    .messages({
      'any.required': 'Password is required',
      'string.empty': 'Password is required',
      'string.min': 'Password must be 6-50 characters',
      'string.max': 'Password must be 6-50 characters',
    })
    .required(),
});

type ValidatedData = {
  password: string;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { admin } = ctx.state;
  const { password } = ctx.validatedData;

  const isPasswordMatch = await securityUtil.compareTextWithHash(password, admin.passwordHash);
  ctx.assertClientError(!isPasswordMatch, {
    password: 'The new password should be different from the previous one',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { admin } = ctx.state;
  const { password } = ctx.validatedData;

  const passwordHash = await securityUtil.getHash(password);

  const updatedAdmin = await adminService.updateOne({ _id: admin._id }, () => ({ passwordHash }));

  ctx.body = adminService.getPublic(updatedAdmin);
}

export default (router: AppRouter) => {
  router.post('/current', validateMiddleware(schema), validator, handler);
};
