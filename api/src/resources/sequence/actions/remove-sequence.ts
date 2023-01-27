import { AppKoaContext, AppRouter } from 'types';

import sequenceAccess from '../middlewares/sequence-access';
import sequenceService from '../sequence.service';


const handler = async (ctx: AppKoaContext) => {
  const { sequenceId } = ctx.params;

  await sequenceService.deleteSoft({ _id: sequenceId });

  ctx.body = {};
};

export default (router: AppRouter) => {
  router.delete('/:sequenceId', sequenceAccess, handler);
};
