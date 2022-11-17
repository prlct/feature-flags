import { AppKoa } from 'types';

import tryToAttachAdmin from './middlewares/try-to-attach-admin.middleware';
import extractAdminToken from './middlewares/extract-admin-token.middleware';
import attachCustomErrors from './middlewares/attach-custom-errors.middleware';
import routeErrorHandler from './middlewares/route-error-handler.middleware';
import publicRoutes from './public.routes';
import privateRoutes from './private.routes';
import adminRoutes from './admin.routes';

const defineRoutes = (app: AppKoa) => {
  app.use(attachCustomErrors);
  app.use(routeErrorHandler);

  app.use(extractAdminToken);
  app.use(tryToAttachAdmin);

  publicRoutes(app);
  privateRoutes(app);
  adminRoutes(app);
};

export default defineRoutes;
