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
  id: Joi.string().trim(),
  data: Joi.object(),
});

type ValidatedData = {
  env: Env;
  email?: string;
  id?: string;
  data?: { [key: string]: any }
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { application } = ctx.state;
  const { env, email, id, data } = ctx.validatedData;
  const externalId = id || email;

  let user = null;
  if (id) {
    user = await userService.findOne({ $or: [{ externalId: id }, { _id: id }] } );
  }
  if (!user && !id && email) {
    user = await userService.findOne({ email } );
  }

  if (user) {
    user = await userService.updateOne(
      { applicationId: application._id, env, _id: user._id },
      (u) => ({
        data: { email : u.email || email, id : u._id || id, ...data },
        lastVisitedOn: new Date(),
      }),
    );
  } else {
    user = await userService.insertOne({
      applicationId: application._id,
      env,
      externalId: externalId,
      email,
      data: { email, id: id, ...data },
      lastVisitedOn: new Date(),
    });
  }

  const features = await featureService.getFeaturesForEnv(application._id, env);
  
  const flagsForUser = await calculateFlagsForUser(features, user);

  const variants = calculateABTestsForUser(id || user?._id || '', features);

  const configs: { [key: string]: string } = featuresToConfigsForUser(features, variants);

  ctx.body = { features: flagsForUser, configs, variants, user };
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
