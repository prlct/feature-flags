import Joi from 'joi';
import { pullAll } from 'lodash';

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
  users: Joi.array()
    .items(Joi.string().trim().email())
    .min(1)
    .max(1000)
    .required(),
});

type ValidatedData = {
  env: FeatureEnv;
  users: string[];
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { featureName } = ctx.params;
  const { env, users } = ctx.validatedData;

  const feature = await featureService.updateOne({ name: featureName }, (doc) => {
    const oldUsers = doc.envSettings[env].users;
    doc.envSettings[env].users = pullAll(oldUsers, users);

    return doc;
  });

  ctx.body = feature ? getFlatFeature(feature, env) : feature;
}

export default (router: AppRouter) => {
  router.delete('/:featureName/users', extractToken, privateTokenAuth, validateMiddleware(schema), handler);
};
