import { AppKoaContext, AppRouter } from 'types';
import pipelineService from 'resources/pipeline/pipeline.service';
import pipelineAccess from '../middlewares/pipeline-access';
import pipelineUserService from '../../pipeline-user/pipeline-user.service';


const handler = async (ctx: AppKoaContext) => {
  const { pipelineId } = ctx.params;

  await pipelineService.updateOne({ _id: pipelineId }, (pipeline) => {
    return { ...pipeline, deletedOn: new Date() };
  });

  await pipelineUserService.atomic.updateMany({ 'pipeline._id': pipelineId }, {
    $set: {
      deletedOn: new Date(),
    },
  });

  ctx.body = {};
};

export default (router: AppRouter) => {
  router.delete('/:pipelineId', pipelineAccess, handler);
};
