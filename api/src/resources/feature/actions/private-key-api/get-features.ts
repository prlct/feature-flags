import Joi from 'joi';

import { validateMiddleware, extractTokenFromHeader } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService, FeatureEnv } from 'resources/feature';

import { privateTokenAuth } from 'resources/application';

// TODO: !!! Fix this. undefined when import FeatureEnv or array of FeatureEnv values from resources/feature
const featureEnvValues = ['development', 'staging', 'production'];

const schema = Joi.object({
  env: Joi.string()
    .valid(...featureEnvValues)
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
});

type ValidatedData = {
  env: FeatureEnv;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { application } = ctx.state;
  const { env } = ctx.validatedData;

  const features = await featureService.getFeaturesForEnv(application._id, env);

  ctx.body = { results: features };
}

export default (router: AppRouter) => {
  router.get(
    '/', 
    extractTokenFromHeader,
    privateTokenAuth,
    validateMiddleware(schema),
    handler,
  );
};
