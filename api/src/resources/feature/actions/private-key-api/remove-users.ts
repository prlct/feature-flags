import Joi from 'joi';
import { pullAll } from 'lodash';

import { validateMiddleware, extractTokenFromHeader } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService, FeatureEnv, Feature } from 'resources/feature';
import { privateTokenAuth } from 'resources/application';
import { getFlatFeature } from '../../utils/get-flat-feature';
import featureExists from '../../middlewares/feature-exists.middleware';

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
  const { application } = ctx.state;
  const { featureName } = ctx.params;
  const { env, users } = ctx.validatedData;

  let feature = await featureService.updateOne({ applicationId: application._id, name: featureName }, (doc) => {
    const oldUsers = doc.envSettings[env].users;
    doc.envSettings[env].users = pullAll(oldUsers, users);

    return doc;
  });

  if (!feature) {
    feature = await featureService.findOne({ applicationId: application._id, name: featureName }) as Feature;
  }

  ctx.body = feature ? getFlatFeature(feature, env) : feature;
}

export default (router: AppRouter) => {
  router.delete(
    '/:featureName/users',
    extractTokenFromHeader,
    privateTokenAuth,
    validateMiddleware(schema),
    featureExists,
    handler,
  );
};
