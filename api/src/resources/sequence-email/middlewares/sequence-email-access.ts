import { AppKoaContext, Next } from 'types';
import sequenceEmailService from 'resources/sequence-email/sequence-email.service';

const sequenceEmailAccess = async (ctx: AppKoaContext, next: Next) => {
  const { sequenceEmailId } = ctx.params;
  const sequenceEmail = await sequenceEmailService.findOne({
    _id: sequenceEmailId,
    applicationId: { $in: ctx.state.admin.applicationIds },
    deletedOn: { $exists: false },
  });

  if (!sequenceEmail) {
    ctx.status = 403;
    ctx.body = {};
    return;
  }

  return next();
};

export default sequenceEmailAccess;
