import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';
import adminRoutes from 'resources/admin/admin.routes';
import featureRoutes from 'resources/feature/feature.routes';
import applicationRoutes from 'resources/application/application.routes';
import companyRoutes from 'resources/company/company.routes';
import userRoutes from 'resources/user/user.routes';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/admins', compose([auth, adminRoutes.privateRoutes])));
  app.use(mount('/features', compose([auth, featureRoutes.privateRoutes])));
  app.use(mount('/applications', compose([auth, applicationRoutes.privateRoutes])));
  app.use(mount('/companies', compose([auth, companyRoutes.privateRoutes])));
  app.use(mount('/feature-flags', featureRoutes.externalRoutes));
  app.use(mount('/users', userRoutes.externalRoutes));
};
