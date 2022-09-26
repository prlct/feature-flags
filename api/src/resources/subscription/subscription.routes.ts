import { routeUtil } from 'utils';

import getCurrent from './actions/get-current';
import subscribe from './actions/subscribe';

const privateRoutes = routeUtil.getRoutes([
  getCurrent,
  subscribe,
]);

export default {
  privateRoutes,
};
