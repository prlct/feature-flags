import { AppKoaContext, AppRouter } from 'types';

import sequenceAccess from '../middlewares/sequence-access';
import sequenceService from '../sequence.service';


const handler = async (ctx: AppKoaContext) => {
  const { sequenceId } = ctx.params;

  await sequenceService.updateOne({ _id: sequenceId }, (pipeline) => {
    return { ...pipeline, deletedOn: new Date() };
  });

  ctx.body = {};
};

export default (router: AppRouter) => {
  router.delete('/:sequenceId', sequenceAccess, handler);
};
