import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { adminService } from 'resources/admin';

import createAdmin from '../middlewares/admin-creation.middleware';

const schema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'First name is required',
      'string.empty': 'First name is required',
    }),
  lastName: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'Last name is required',
      'string.empty': 'Last name is required',
    }),
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
  firstName: string;
  lastName: string;
  email: string;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;

  const isAdminExists = await adminService.exists({ email });
  ctx.assertClientError(!isAdminExists, {
    email: 'User with this email is already registered',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const {
    firstName,
    lastName,
    email,
  } = ctx.validatedData;

  ctx.state.authAdminData = {
    firstName,
    lastName,
    email,
    isEmailVerified:false,
  };

  await next();

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/sign-up', validateMiddleware(schema), validator, handler, createAdmin);
};
