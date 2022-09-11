import Joi from 'joi';
import { omitBy, isNil } from 'lodash';

import { validateMiddleware, extractTokenFromHeader } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { Env, privateTokenAuth } from 'resources/application';
import { featureService, Feature } from 'resources/feature';
import { getFlatFeature } from '../../utils/get-flat-feature';
import featureExists from '../../middlewares/feature-exists.middleware';


const schema = Joi.object({
  env: Joi.string()
    .valid(...Object.values(Env))
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
  enabled: Joi.boolean(),
  enabledForEveryone: Joi.boolean(),
}).or('enabled', 'enabledForEveryone');

type ValidatedData = {
  env: Env;
  enabled?: boolean;
  enabledForEveryone?: boolean;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { application } = ctx.state;
  const { featureName } = ctx.params;
  const { env, enabled, enabledForEveryone } = ctx.validatedData;

  const updateData = omitBy({ enabled, enabledForEveryone }, isNil);

  let feature = await featureService.updateOne({ applicationId: application._id, name: featureName }, (doc) => {
    doc.envSettings[env] = { ...doc.envSettings[env], ...updateData };

    return doc;
  });

  if (!feature) {
    feature = await featureService.findOne({ applicationId: application._id, name: featureName }) as Feature;
  }

  ctx.body = getFlatFeature(feature, env);
}

export default (router: AppRouter) => {
  router.put(
    '/:featureName',
    extractTokenFromHeader, 
    privateTokenAuth, 
    featureExists, 
    validateMiddleware(schema), 
    handler,
  );
};
