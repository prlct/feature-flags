import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService, Feature } from 'resources/feature';

import featureAuth from '../middlewares/feature-auth.middleware';
import { Env } from '../../application';
import { remoteConfigSchema } from '../feature.schema';

const schema = Joi.object({
  env: Joi.string()
    .valid(...Object.values(Env))
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
  remoteConfig: remoteConfigSchema,
});

type ValidatedData = {
  remoteConfig: string;
  env: Env,
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { featureId } = ctx.params;
  const { remoteConfig, env } = ctx.validatedData;

  const updatedFeature = await featureService.updateOne(
    { _id: featureId },
    (doc) => {
      doc.envSettings[env].remoteConfig = remoteConfig;
      return doc;
    },
  ) as Feature;

  ctx.body = updatedFeature;
}

export default (router: AppRouter) => {
  router.put('/:featureId/remote-config', featureAuth, validateMiddleware(schema), handler);
};
