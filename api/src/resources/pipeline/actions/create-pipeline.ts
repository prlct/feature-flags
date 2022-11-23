import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import featureAuth from '../../feature/middlewares/feature-auth.middleware';
import pipelineService from '../pipeline.service';
import { Env } from '../../application';

const schema = Joi.object({
  name: Joi.string().required(),
  env: Joi.string().valid(...Object.values(Env)),
});

type ValidatedData = {
  name: string,
  env: Env,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { applicationId } = ctx.params;
  const { name, env } = ctx.validatedData;

  ctx.body = await pipelineService.insertOne({
    applicationId,
    name,
    env,
  });
};

export default (router: AppRouter) => {
  router.post('/', featureAuth, validateMiddleware(schema), handler);
};
