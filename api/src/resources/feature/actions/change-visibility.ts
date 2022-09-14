import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService, Feature } from 'resources/feature';
import { Env } from 'resources/application';
import { getFlatFeature } from '../utils/get-flat-feature';
import featureAuth from '../middlewares/feature-auth.middleware';

const schema = Joi.object({
  env: Joi.string()
    .valid(...Object.values(Env))
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
  enabledForEveryone: Joi.boolean()
    .required()
    .messages({
      'any.required': 'enabledForEveryone is required',
      'boolean.empty': 'enabledForEveryone is required',
    }),
});

type ValidatedData = {
  env: Env;
  enabledForEveryone: boolean;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { featureId } = ctx.params;
  const { env, enabledForEveryone } = ctx.validatedData;

  const feature = await featureService.updateOne(
    { _id: featureId },
    (doc) => {
      doc.envSettings[env].enabledForEveryone = enabledForEveryone;
      doc.envSettings[env].visibilityChangedOn = new Date();
      return doc;
    },
  ) as Feature;

  ctx.body = getFlatFeature(feature, env);
}

export default (router: AppRouter) => {
  router.put('/:featureId/visibility', featureAuth, validateMiddleware(schema), handler);
};
