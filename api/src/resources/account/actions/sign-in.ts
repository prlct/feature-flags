import Joi from 'joi';
import { Magic, Claim } from '@magic-sdk/admin';

import { authService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { adminService, Admin } from 'resources/admin';
import config from 'config';

const magic = new Magic(config.MAGIC_SECRET_KEY);

const schema = Joi.object({
  DIDToken: Joi.string()
    .required()
    .messages({
      'any.required': 'DID token is required',
    }),
});

type ValidatedData = {
  DIDToken: string;
  admin?: Admin;
  metadataEmail: string;
  claim: Claim;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { DIDToken } = ctx.validatedData;

  magic.token.validate(DIDToken);
  const [, claim] =  magic.token.decode(DIDToken);

  const [metadata, admin] = await Promise.all([
    magic.users.getMetadataByIssuer(claim.iss),
    adminService.findOne({ issuer: claim.iss }),
  ]);

  if (admin) {
    const lastLoginTimestampInSec = new Date(admin.lastLoginOn).getTime() / 1000;

    if (claim.iat <= lastLoginTimestampInSec) {
      // TODO: Add notifications for dev team
      console.log(`!!! Replay attack detected for admin ${admin.issuer}}. !!!`);

      ctx.assertClientError(false, {
        global: 'Invalid credentials',
      }, 401);
    }
  }

  ctx.assertClientError(metadata.email, {
    global: 'Email not provided by Magic Link',
  });

  ctx.validatedData.admin = admin || undefined;
  ctx.validatedData.metadataEmail = metadata.email;
  ctx.validatedData.claim = claim;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { admin: oldAdmin, metadataEmail, claim } = ctx.validatedData;

  const admin = oldAdmin || await adminService.insertOne({
    issuer: claim.iss,
    email: metadataEmail,
    isEmailVerified: true,
  });

  await Promise.all([
    adminService.updateLastLogin(admin._id, claim.iat * 1000),
    authService.setTokens(ctx, admin._id),
  ]);

  ctx.body = adminService.getPublic(admin);
}

export default (router: AppRouter) => {
  router.post('/sign-in', validateMiddleware(schema), validator, handler);
};
