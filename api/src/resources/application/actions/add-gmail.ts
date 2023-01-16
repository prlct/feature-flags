import { nanoid } from 'nanoid';

import { AppKoaContext, AppRouter } from 'types';
import { getRedirectUrl } from 'services/google/gmail-sender.service';

import { applicationAuth, permissionsMiddlewareMiddleware } from '../middlewares';

const handler = async (ctx: AppKoaContext) => {
  const { applicationId } = ctx.params;

  const fiveMinutesMillis = 1000 * 60 * 5;

  const state = nanoid(16);
  ctx.cookies.set('appId', applicationId, {
    signed: true,
    maxAge: fiveMinutesMillis,
  });
  ctx.cookies.set('gmail-add-state', state, {
    signed: true,
    maxAge: fiveMinutesMillis,
  });

  const url = await getRedirectUrl(applicationId, state);

  ctx.redirect(url);
};

export default (router: AppRouter) => {
  router.get(
    '/:applicationId/add-gmail',
    applicationAuth,
    permissionsMiddlewareMiddleware(['manageSenderEmails']),
    handler,
  );
};
