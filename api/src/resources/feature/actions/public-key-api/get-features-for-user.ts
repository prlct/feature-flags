import Joi from 'joi';

import { validateMiddleware, extractTokenFromHeader } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService } from 'resources/feature';
import { Env } from 'resources/application';
import { publicTokenAuth, extractTokenFromQuery } from 'resources/application';
import { userService } from 'resources/user';
import { calculateABTestsForUser, calculateFlagsForUser, featuresToConfigsForUser } from './helpers';

const schema = Joi.object({
  env: Joi.string()
    .valid(...Object.values(Env))
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
  email: Joi.string().trim(),
  userId: Joi.string().trim(),
});

type ValidatedData = {
  env: Env;
  email?: string;
  userId?: string;
  id?: string;
  data?: { [key: string]: any }
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { application } = ctx.state;
  const { env, email, userId, id, data } = ctx.validatedData;
  const externalId = userId || email;

  let user = userId || email
    ? await userService.findOne({ $or: [{ _id: userId }, { email: email }] })
    : null;

  if (!user) {
    user = await userService.insertOne({
      applicationId: application._id,
      externalId: externalId,
      env,
      email,
      data: { email, id, ...data },
      lastVisitedOn: new Date(),
    });
  }

  const features = await featureService.getFeaturesForEnv(application._id, env);
  
  const flagsForUser = await calculateFlagsForUser(features, user);

  const variants = calculateABTestsForUser(userId || user?._id || '', features);

  const configs: { [key: string]: string } = featuresToConfigsForUser(features, variants);

  ctx.body = { features: flagsForUser, configs, variants };
}

export default (router: AppRouter) => {
  router.get(
    '/features',
    extractTokenFromHeader, 
    extractTokenFromQuery, 
    publicTokenAuth,
    validateMiddleware(schema), 
    handler,
  );
};
