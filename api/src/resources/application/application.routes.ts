import { routeUtil } from 'utils';

import createFeature from './actions/create-feature';
import getApplication from './actions/get-application';
import getFeatures from './actions/get-features';
import createPipeline from './actions/create-pipeline';
import createSequence from './actions/create-sequence';

const privateRoutes = routeUtil.getRoutes([
  createFeature,
  createPipeline,
  createSequence,
  getApplication,
  getFeatures,
]);

export default {
  privateRoutes,
};
