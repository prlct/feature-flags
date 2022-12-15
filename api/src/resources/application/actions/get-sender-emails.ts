import { AppKoaContext, AppRouter } from 'types';

import applicationAuth from '../middlewares/application-auth.middleware';
import applicationService from '../application.service';

async function handler(ctx: AppKoaContext) {
  const { applicationId } = ctx.params;

  const res = await applicationService.findOne(
    { _id: applicationId },
    { projection: { 'gmailCredentials': 1 },
    },
  );

  ctx.body = Object.keys(res?.gmailCredentials || {}).map(email => ({ value: email, label: email }));
}

export default (router: AppRouter) => {
  router.get('/:applicationId/sender-emails', applicationAuth, handler);
};
