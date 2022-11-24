import { includes } from 'lodash';
import { AppKoaContext, Next } from 'types';
import sequenceService from '../sequence.service';

const sequenceAccess = async (ctx: AppKoaContext, next: Next) => {
  const { sequenceId } = ctx.params;
  const sequence = await sequenceService.findOne({ _id: sequenceId });

  if (!sequence) {
    ctx.status = 404;
    ctx.body = {};
    return;
  }


  const isAdminHasAccessToApplication = includes(ctx.state.admin.applicationIds, sequence.applicationId);

  if (!isAdminHasAccessToApplication) {
    ctx.status = 403;
    ctx.body = {};
    return;
  }


  return next();
};

export default sequenceAccess;
