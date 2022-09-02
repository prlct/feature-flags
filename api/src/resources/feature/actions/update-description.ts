import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService, Feature } from 'resources/feature';
import featureAuth from '../middlewares/feature-auth.middleware';

const DESCRIPTION_MAX_LENGTH = 300;

const schema = Joi.object({
  description: Joi.string()
    .trim()
    .max(DESCRIPTION_MAX_LENGTH)
    .allow(''),
});

type ValidatedData = {
  description: string;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { featureId } = ctx.params;
  const { description } = ctx.validatedData;
  
  const updatedFeature = await featureService.updateOne(
    { _id: featureId },
    (doc) => {
      doc.description = description;
      return doc;
    },
  ) as Feature;

  ctx.body = updatedFeature;
}

export default (router: AppRouter) => {
  router.put('/:featureId/description', featureAuth, validateMiddleware(schema), handler);
};