import Joi from 'joi';
import { Magic, Claim } from '@magic-sdk/admin';

import { authService } from 'services';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { userService, User } from 'resources/user';
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
  user?: User;
  metadataEmail: string;
  claim: Claim;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { DIDToken } = ctx.validatedData;

  magic.token.validate(DIDToken);
  const [, claim] =  magic.token.decode(DIDToken);

  const [metadata, user] = await Promise.all([
    magic.users.getMetadataByIssuer(claim.iss),
    userService.findOne({ issuer: claim.iss }),
  ]);

  if (user) {
    const lastLoginTimestampInSec = new Date(user.lastLoginOn).getTime() / 1000;

    if (claim.iat <= lastLoginTimestampInSec) {
      // TODO: Add notifications for dev team
      console.log(`!!! Replay attack detected for user ${user.issuer}}. !!!`);

      ctx.assertClientError(false, {
        global: 'Invalid credentials',
      }, 401);
    }
  }

  ctx.assertClientError(metadata.email, {
    global: 'Email not provided by Magic Link',
  });

  ctx.validatedData.user = user || undefined;
  ctx.validatedData.metadataEmail = metadata.email;
  ctx.validatedData.claim = claim;

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user: oldUser, metadataEmail, claim } = ctx.validatedData;

  const user = oldUser || await userService.insertOne({
    issuer: claim.iss,
    email: metadataEmail,
    isEmailVerified: true,
  });

  await Promise.all([
    userService.updateLastLogin(user._id, claim.iat * 1000),
    authService.setTokens(ctx, user._id),
  ]);

  ctx.body = userService.getPublic(user);
}

export default (router: AppRouter) => {
  router.post('/sign-in', validateMiddleware(schema), validator, handler);
};
