import Joi from 'joi';

import pipelineService from '../pipeline.service';
import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import pipelineAccess from '../middlewares/pipeline-access';

const schema = Joi.object({
  name: Joi.string().trim(),
});

type ValidatedData = {
  name: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { pipelineId } = ctx.params;
  const { name } = ctx.validatedData;

  ctx.body = await pipelineService.updateOne({ _id: pipelineId }, (pipeline) => {
    return { ...pipeline, name };
  });
};

export default (router: AppRouter) => {
  router.put('/:pipelineId', pipelineAccess, validateMiddleware(schema), handler);
};
