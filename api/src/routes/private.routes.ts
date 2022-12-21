import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';
import adminRoutes from 'resources/admin/admin.routes';
import featureRoutes from 'resources/feature/feature.routes';
import applicationRoutes from 'resources/application/application.routes';
import companyRoutes from 'resources/company/company.routes';
import userRoutes from 'resources/user/user.routes';
import userEvents from 'resources/user-event/user-event.routes';
import subscription from 'resources/subscription/subscription.routes';
import statistics from 'resources/statistics/statistics.routes';
import pipelines from 'resources/pipeline/pipeline.routes';
import sequences from 'resources/sequence/sequence.routes';
import sequenceEmails from 'resources/sequence-email/sequence-email.routes';
import pipelineUserRoutes from 'resources/pipeline-user/pipeline-user.routes';
import pipelineUsersListRoutes from 'resources/pipeline-user/pipeline-user.routes';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/admins', compose([auth, adminRoutes.privateRoutes])));
  app.use(mount('/features', compose([auth, featureRoutes.privateRoutes])));
  app.use(mount('/applications', compose([auth, applicationRoutes.privateRoutes])));
  app.use(mount('/companies', compose([auth, companyRoutes.privateRoutes])));
  app.use(mount('/feature-flags', featureRoutes.externalRoutes));
  app.use(mount('/users', userRoutes.externalRoutes));
  app.use(mount('/user-events', userEvents.externalRoutes));
  app.use(mount('/subscriptions', compose([auth, subscription.privateRoutes])));
  app.use(mount('/statistics', compose([auth, statistics.privateRoutes])));
  app.use(mount('/email-sequences', sequences.publicRoutes));
  app.use(mount('/pipelines', compose([auth, pipelines.privateRoutes])));
  app.use(mount('/sequences', compose([auth, sequences.privateRoutes])));
  app.use(mount('/sequence-emails', compose([auth, sequenceEmails.privateRoutes])));
  app.use(mount('/pipeline-users', compose([auth, pipelineUserRoutes.privateRoutes])));
  app.use(mount('/pipeline-users-list', compose([auth, pipelineUsersListRoutes.privateRoutes])));
};
