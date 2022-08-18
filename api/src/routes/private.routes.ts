import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';
import { adminRoutes } from 'resources/admin';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/admins', compose([auth, adminRoutes.privateRoutes])));
};
