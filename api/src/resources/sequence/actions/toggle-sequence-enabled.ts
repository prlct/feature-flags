import { AppKoaContext, AppRouter } from 'types';

import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import sequenceService from 'resources/sequence/sequence.service';

import sequenceAccess from '../middlewares/sequence-access';


const handler = async (ctx: AppKoaContext) => {
  const { sequenceId } = ctx.params;

  const sequence = await sequenceService.findOne({ _id: sequenceId, deletedOn: { $exists: false } });

  if (!sequence) {
    ctx.throwClientError({ sequence: 'Sequence not found or was removed' }, 400);
    return;
  }

  const { results: enabledEmails } = await sequenceEmailService.find({
    sequenceId,
    enabled: true,
    deletedOn: { $exists: false },
  });

  if (enabledEmails.length < 1 && !sequence.enabled) {
    ctx.throwClientError({ sequence: 'Sequence with no emails can not be enabled' }, 400);
    return;
  }

  ctx.body = await sequenceService.updateOne({ _id: sequenceId }, (seq) => {
    return { ...seq, enabled: !seq.enabled };
  });
};

export default (router: AppRouter) => {
  router.put('/:sequenceId/toggle-enabled', sequenceAccess, handler);
};
