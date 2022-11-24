import { AppKoaContext, Next } from 'types';
import sequenceService from '../sequence.service';

const sequenceAccess = async (ctx: AppKoaContext, next: Next) => {
  const { sequenceId } = ctx.params;
  const sequence = await sequenceService.findOne({
    _id: sequenceId,
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
