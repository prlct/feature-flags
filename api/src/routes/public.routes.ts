import mount from 'koa-mount';

import { AppKoa, AppRouter } from 'types';
import accountRoutes from 'resources/account/account.routes';
import invitationRoutes from 'resources/invitation/invitation.routes';

const healthCheckRouter = new AppRouter();
healthCheckRouter.get('/health', ctx => ctx.status = 200);
healthCheckRouter.get('/', ctx => ctx.body = ':)');

export default (app: AppKoa) => {
  app.use(healthCheckRouter.routes());
  app.use(mount('/account', accountRoutes.publicRoutes));
  app.use(mount('/invitations', invitationRoutes.publicRoutes));
};
