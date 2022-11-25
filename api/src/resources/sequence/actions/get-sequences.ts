import Joi from 'joi';

import sequenceService from 'resources/sequence/sequence.service';
import { AppKoaContext, AppRouter } from 'types';
import pipelineAccess from 'resources/pipeline/middlewares/pipeline-access';
import { validateMiddleware } from 'middlewares';

const schema = Joi.object({
  pipelineId: Joi.string().trim().required(),
});

type ValidatedData = {
  pipelineId: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { pipelineId } = ctx.validatedData;

  const { results: sequences } = await sequenceService.find({ pipelineId,  deletedOn: { $exists: false } });

  ctx.body = sequences;
};

export default (router: AppRouter) => {
  router.get('/', pipelineAccess, validateMiddleware(schema), handler);
};
