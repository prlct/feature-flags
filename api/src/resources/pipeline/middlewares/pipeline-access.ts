import { AppKoaContext, Next } from 'types';
import pipelineService from '../pipeline.service';

const sequenceAccess = async (ctx: AppKoaContext, next: Next) => {
  const { pipelineId } = ctx.params;
  const sequence = await pipelineService.findOne({
    _id: pipelineId,
    applicationId: { $in: ctx.state.admin.applicationIds },
    deletedOn: { $exists: false },
  });

  if (!sequence) {
    ctx.status = 403;
    ctx.body = {};
    return;
  }

  return next();
};

export default sequenceAccess;
