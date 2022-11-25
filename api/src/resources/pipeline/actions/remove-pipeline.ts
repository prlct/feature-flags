import { AppKoaContext, AppRouter } from 'types';
import pipelineService from 'resources/pipeline/pipeline.service';
import pipelineAccess from '../middlewares/pipeline-access';


const handler = async (ctx: AppKoaContext) => {
  const { pipelineId } = ctx.params;

  await pipelineService.updateOne({ _id: pipelineId }, (pipeline) => {
    return { ...pipeline, deletedOn: new Date() };
  });

  ctx.body = {};
};

export default (router: AppRouter) => {
  router.delete('/:pipelineId', pipelineAccess, handler);
};
