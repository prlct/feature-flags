import { routeUtil } from 'utils';

import getFeatures from './actions/get-features';

const privateRoutes = routeUtil.getRoutes([
  getFeatures,
]);

export default {
  privateRoutes,
};
