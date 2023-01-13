import { routeUtil } from 'utils';

import get from './actions/get';

const privateRoutes = routeUtil.getRoutes([
  get,
]);

export default {
  privateRoutes,
};
