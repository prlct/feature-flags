import Joi from 'joi';
import { forEach, includes } from 'lodash';

import { validateMiddleware, extractTokenFromHeader } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService, FeatureEnv, FlatFeature } from 'resources/feature';
import { publicTokenAuth } from 'resources/application';

// TODO: !!! Fix this. undefined when import FeatureEnv or array of FeatureEnv values from resources/feature
const featureEnvValues = ['development', 'staging', 'production'];

const formatFlatFeaturesToSdkResponse = (items: FlatFeature[], email?: string) => {
  const features: { [key: string]: boolean } = {};

  forEach(items, ({ name, enabled, enabledForEveryone, users }) => {
    if (!enabled) {
      return;
    }

    if (enabledForEveryone) {
      features[name] = true;

      return;
    }
    
    if (email) {
      const isFeatureEnabledForUser = includes(users, email);

      if (isFeatureEnabledForUser) {
        features[name] = true;
      }
    }
  });

  const configs: { [key: string]: boolean } = {};

  const response = { features, configs };

  return response;
};

const schema = Joi.object({
  env: Joi.string()
    .valid(...featureEnvValues)
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
  email: Joi.string().trim(),
});

type ValidatedData = {
  env: FeatureEnv;
  email?: string;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { application } = ctx.state;
  const { env, email } = ctx.validatedData;

  const features = await featureService.getFeaturesForEnv(application._id, env);

  ctx.body = formatFlatFeaturesToSdkResponse(features, email);
}

export default (router: AppRouter) => {
  router.get(
    '/features',
    extractTokenFromHeader, 
    publicTokenAuth,
    validateMiddleware(schema), 
    handler,
  );
};
