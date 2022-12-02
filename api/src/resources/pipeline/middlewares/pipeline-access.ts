import { AppKoaContext, Next } from 'types';
import pipelineService from '../pipeline.service';

const pipelineAccess = async (ctx: AppKoaContext, next: Next) => {
  const pipelineId = ctx.params.pipelineId || ctx.query.pipelineId;

  const pipeline = await pipelineService.findOne({
    _id: pipelineId,
    applicationId: { $in: ctx.state.admin.applicationIds },
    deletedOn: { $exists: false },
  });

  if (!pipeline) {
    ctx.status = 403;
    ctx.body = {};
    return;
  }

  return next();
};

export default pipelineAccess;
