import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService, FeatureEnv } from 'resources/feature';
import { getFlatFeature } from '../utils/get-flat-feature';

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
  const { featureId } = ctx.params;
  const { env } = ctx.validatedData;

  const feature = await featureService.updateOne(
    { _id: featureId },
    (doc) => {
      doc.envSettings[env].enabled = !doc.envSettings[env].enabled;
      return doc;
    },
  );

  // TODO: Add feature null error
  ctx.body = feature ? getFlatFeature(feature, env) : {};
}

export default (router: AppRouter) => {
  router.post('/:featureId/toggler', validateMiddleware(schema), handler);
};
