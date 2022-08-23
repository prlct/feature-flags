import { routeUtil } from 'utils';

import createFeature from './actions/create-feature';
import getApplication from './actions/get-application';
import getFeatures from './actions/get-features';

const privateRoutes = routeUtil.getRoutes([
  createFeature,
  getApplication,
  getFeatures,
]);

export default {
  privateRoutes,
};
