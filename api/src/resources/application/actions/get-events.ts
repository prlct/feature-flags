import { AppKoaContext, AppRouter } from 'types';

import applicationAuth from '../middlewares/application-auth.middleware';
import applicationService from '../application.service';

async function handler(ctx: AppKoaContext) {
  const { applicationId, env } = ctx.params;

  const events = await applicationService.findOne({ _id: applicationId }, { projection: { events: 1 } });

  ctx.body = events;
}

export default (router: AppRouter) => {
  router.get('/:applicationId/events', applicationAuth, handler);
};
