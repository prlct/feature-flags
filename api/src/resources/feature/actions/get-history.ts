import Joi from 'joi';
import { Env } from 'resources/application';
import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';

import featureAuth from '../middlewares/feature-auth.middleware';
import featureService from '../feature.service';
import { Feature } from 'resources/feature';


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
  env: Env;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { featureId } = ctx.params;
  const { env } = ctx.validatedData;

  const feature = await featureService.findOne({ _id: featureId }) as Feature;

  ctx.body = feature.history?.filter((h) => h.env === env) || [];
}

export default (router: AppRouter) => {
  router.get('/:featureId/history', featureAuth, validateMiddleware(schema), handler);
};