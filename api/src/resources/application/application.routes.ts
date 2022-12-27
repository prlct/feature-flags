import { routeUtil } from 'utils';

import createFeature from './actions/create-feature';
import getApplication from './actions/get-application';
import getFeatures from './actions/get-features';
import createPipeline from './actions/create-pipeline';
import createSequence from './actions/create-sequence';
import createSequenceEmail from './actions/create-sequence-email';
import addPipelineUsers from './actions/add-pipeline-users';
import addPipelineUsersList from './actions/add-pipeline-users-list';
import addPipelinesToUser from './actions/add-pipelines-to-user';
import getEvents from './actions/get-events';
import createEvent from './actions/create-event';
import addGmail from './actions/add-gmail';
import addGmailCallback from './actions/add-gmail-callback';
import getSenderEmails from './actions/get-sender-emails';
import triggerEvent from './actions/trigger-event';

const privateRoutes = routeUtil.getRoutes([
  createFeature,
  createPipeline,
  createSequence,
  createSequenceEmail,
  getApplication,
  getFeatures,
  addPipelineUsers,
  addPipelineUsersList,
  addPipelinesToUser,
  getEvents,
  createEvent,
  addGmail,
  getSenderEmails,
]);

const publicRoutes = routeUtil.getRoutes([
  addGmailCallback,
  triggerEvent,
]);

export default {
  privateRoutes,
  publicRoutes,
};
