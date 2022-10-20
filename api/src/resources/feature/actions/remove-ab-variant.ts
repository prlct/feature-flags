import Joi from 'joi';

import { AppKoaContext, AppRouter } from 'types';
import { Feature, featureService } from 'resources/feature';
import featureAuth from '../middlewares/feature-auth.middleware';
import { validateMiddleware } from 'middlewares';

import { Env } from '../../application';

const schema = Joi.object({
  env: Joi.string()
    .valid(...Object.values(Env))
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
});

type ValidatedData = {
  env: Env,
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { featureId, variantIndex } = ctx.params;
  const { env } = ctx.validatedData;

  const updatedFeature = await featureService.updateOne(
    { _id: featureId },
    (doc) => {
      doc.envSettings[env].tests = doc.envSettings[env].tests.filter((_, index) => index !== +variantIndex);
      return doc;
    },
  ) as Feature;

  ctx.body = updatedFeature;
}

export default (router: AppRouter) => {
  router.delete('/:featureId/tests/:variantIndex', featureAuth, validateMiddleware(schema), handler);
};
