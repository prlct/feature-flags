import { AppKoaContext, AppRouter } from 'types';

import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import sequenceEmailAccess from '../middlewares/sequence-email-access';

const handler = async (ctx: AppKoaContext) => {
  const { sequenceEmailId } = ctx.params;

  ctx.body = await sequenceEmailService.updateOne(
    { _id: sequenceEmailId },
    (email)=> {
      return { ...email, enabled: !email.enabled };
    },
  );
};

export default (router: AppRouter) => {
  router.put('/:sequenceEmailId/toggle', sequenceEmailAccess, handler);
};
