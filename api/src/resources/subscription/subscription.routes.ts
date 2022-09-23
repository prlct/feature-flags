import { routeUtil } from 'utils';

import subscribe from './actions/subscribe';

const privateRoutes = routeUtil.getRoutes([
  subscribe
]);

export default {
  privateRoutes,
};
