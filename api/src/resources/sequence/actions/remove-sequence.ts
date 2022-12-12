import { AppKoaContext, AppRouter } from 'types';

import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import sequenceAccess from '../middlewares/sequence-access';
import sequenceService from '../sequence.service';


const handler = async (ctx: AppKoaContext) => {
  const { sequenceId } = ctx.params;

  await sequenceService.updateOne({ _id: sequenceId }, (pipeline) => {
    return { ...pipeline, deletedOn: new Date() };
  });

  await pipelineUserService.atomic.updateMany({ 'sequence._id': sequenceId }, {
    $set: {
      deletedOn: new Date(),
    },
  });

  ctx.body = {};
};

export default (router: AppRouter) => {
  router.delete('/:sequenceId', sequenceAccess, handler);
};
