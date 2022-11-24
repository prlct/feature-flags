import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import pipelineService from 'resources/pipeline/pipeline.service';
import { Env } from '../index';
import applicationAuth from '../middlewares/application-auth.middleware';

const schema = Joi.object({
  name: Joi.string().required(),
  env: Joi.string().valid(...Object.values(Env)),
});

type ValidatedData = {
  name: string,
  env: Env,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { name, env } = ctx.validatedData;
  const { applicationId } = ctx.params;

  ctx.body = await pipelineService.insertOne({
    applicationId,
    name,
    env,
  });
};

export default (router: AppRouter) => {
  router.post('/:applicationId/pipelines', applicationAuth, validateMiddleware(schema), handler);
};
