import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService, FeatureEnv } from 'resources/feature';

import extractToken from '../../middlewares/extract-header-token.middleware';
import privateTokenAuth from '../../middlewares/private-token-auth.middleware';

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

  ctx.body = features;
}

export default (router: AppRouter) => {
  router.get('/', extractToken, privateTokenAuth, validateMiddleware(schema), handler);
};
