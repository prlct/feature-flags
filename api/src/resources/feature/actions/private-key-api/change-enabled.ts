import Joi from 'joi';
import { omitBy, isNil } from 'lodash';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService, FeatureEnv } from 'resources/feature';
import { getFlatFeature } from '../../utils/get-flat-feature';
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
  enabled: Joi.boolean(),
  enabledForEveryone: Joi.boolean(),
}).or('enabled', 'enabledForEveryone');

type ValidatedData = {
  env: FeatureEnv;
  enabled?: boolean;
  enabledForEveryone?: boolean;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { featureName } = ctx.params;
  const { env, enabled, enabledForEveryone } = ctx.validatedData;

  const updateData = omitBy({ enabled, enabledForEveryone }, isNil);

  const feature = await featureService.updateOne({ name: featureName }, (doc) => {
    doc.envSettings[env] = { ...doc.envSettings[env], ...updateData };

    return doc;
  });

  ctx.body = feature ? getFlatFeature(feature, env) : feature;
}

export default (router: AppRouter) => {
  router.put('/:featureName', extractToken, privateTokenAuth, validateMiddleware(schema), handler);
};
