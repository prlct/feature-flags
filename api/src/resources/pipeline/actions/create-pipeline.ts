import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter, Next } from 'types';

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

  const createdPipeline = await pipelineService.insertOne({
    applicationId,
    name,
    env,
  });

  ctx.body = createdPipeline;
};

export default (router: AppRouter) => {
  router.post('/pipelines', featureAuth, validateMiddleware(schema), handler);
};
