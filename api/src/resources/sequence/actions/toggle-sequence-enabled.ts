import sequenceService from '../sequence.service';
import { AppKoaContext, AppRouter } from 'types';

import sequenceAccess from '../middlewares/sequence-access';


const handler = async (ctx: AppKoaContext) => {
  const { sequenceId } = ctx.params;

  ctx.body = await sequenceService.updateOne({ _id: sequenceId }, (seq) => {
    return { ...seq, enabled: !seq.enabled };
  });
};

export default (router: AppRouter) => {
  router.put('/:sequenceId/toggle-enabled', sequenceAccess, handler);
};
