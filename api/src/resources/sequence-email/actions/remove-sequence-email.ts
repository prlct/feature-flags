import { AppKoaContext, AppRouter } from 'types';

import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import sequenceEmailAccess from '../middlewares/sequence-email-access';

const handler = async (ctx: AppKoaContext) => {
  const { sequenceEmailId } = ctx.params;

  ctx.body = await sequenceEmailService.deleteSoft({ _id: sequenceEmailId });
};

export default (router: AppRouter) => {
  router.delete('/:sequenceEmailId', sequenceEmailAccess, handler);
};
