import { routeUtil } from 'utils';

import acceptInvitation from './actions/accept-invitation';

const publicRoutes = routeUtil.getRoutes([
  acceptInvitation,
]);

export default {
  publicRoutes,
};
