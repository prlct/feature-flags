import { routeUtil } from 'utils';

import confirmInvitation from './actions/confirm-invitation';

const publicRoutes = routeUtil.getRoutes([
  confirmInvitation,
]);

export default {
  publicRoutes,
};
