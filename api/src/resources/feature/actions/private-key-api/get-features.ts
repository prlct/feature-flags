import Joi from 'joi';

import { validateMiddleware, extractTokenFromHeader } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { featureService } from 'resources/feature';
import { Env, privateTokenAuth } from 'resources/application';

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
  const { application } = ctx.state;
  const { env } = ctx.validatedData;

  const features = await featureService.getFeaturesForEnv(application._id, env);

  ctx.body = { results: features };
}

export default (router: AppRouter) => {
  router.get(
    '/', 
    extractTokenFromHeader,
    privateTokenAuth,
    validateMiddleware(schema),
    handler,
  );
};
