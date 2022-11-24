import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import sequenceService from 'resources/sequence/sequence.service';
import applicationAuth from '../middlewares/application-auth.middleware';

const schema = Joi.object({
  name: Joi.string().required(),
  pipelineId: Joi.string().required(),
});

type ValidatedData = {
  name: string,
  pipelineId: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { applicationId } = ctx.params;
  const { name, pipelineId } = ctx.validatedData;

  ctx.body = await sequenceService.insertOne({
    applicationId,
    pipelineId,
    name,
    enabled: false,
  });
};

export default (router: AppRouter) => {
  router.post('/:applicationId/sequences', applicationAuth, validateMiddleware(schema), handler);
};
