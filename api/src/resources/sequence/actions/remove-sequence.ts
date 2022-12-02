import { AppKoaContext, AppRouter } from 'types';
import sequenceService from 'resources/sequence/sequence.service';
import sequenceAccess from '../middlewares/sequence-access';

const handler = async (ctx: AppKoaContext) => {
  const { sequenceId } = ctx.params;

  await sequenceService.updateOne({ _id: sequenceId }, (sequence) => {
    return { ...sequence, deletedOn: new Date() };
  });

  ctx.body = {};
};

export default (router: AppRouter) => {
  router.delete('/:sequenceId', sequenceAccess, handler);
};
