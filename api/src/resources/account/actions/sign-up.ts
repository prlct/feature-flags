import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { securityUtil } from 'utils';
import { PUBLIC_API_KEY_SECURITY_LENGTH, PRIVATE_API_KEY_SECURITY_LENGTH } from 'app.constants';
import { adminService } from 'resources/admin';
import { companyService } from 'resources/company';
import { applicationService } from 'resources/application';

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

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    firstName,
    lastName,
    email,
  } = ctx.validatedData;

  const admin = await adminService.insertOne({
    email,
    firstName,
    lastName,
    isEmailVerified: false,
  });

  const company = await companyService.insertOne({
    ownerId: admin._id,
    applicationIds: [],
    adminIds: [admin._id],
  });

  // TODO: Add collision check?
  const publicApiKey = securityUtil.generateSecureToken(PUBLIC_API_KEY_SECURITY_LENGTH);
  const privateApiKey = securityUtil.generateSecureToken(PRIVATE_API_KEY_SECURITY_LENGTH);

  const application = await applicationService.insertOne({
    publicApiKey,
    privateApiKey,
    companyId: company._id,
    featureIds: [],
  });

  await Promise.all([
    companyService.updateOne(
      { _id: company._id },
      () => ({ applicationIds: [application._id] }),
    ),
    adminService.updateOne(
      { _id: admin._id },
      () => ({ applicationIds: [application._id] }),
    ),
  ]);

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/sign-up', validateMiddleware(schema), validator, handler);
};
