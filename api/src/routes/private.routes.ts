import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';
import { adminRoutes } from 'resources/admin';
import { featureRoutes } from 'resources/feature';
import { applicationRoutes } from 'resources/application';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/admins', compose([auth, adminRoutes.privateRoutes])));
  // TODO: Check that admin allowed to use this feature
  app.use(mount('/features', compose([auth, featureRoutes.privateRoutes])));
  // TODO: Check that admin allowed to use this application
  app.use(mount('/applications', compose([auth, applicationRoutes.privateRoutes])));
};
