import { routeUtil } from 'utils';

import acceptInvitation from './actions/accept-invitation';
import acceptAdminExists from './actions/accept-admin-exists';

const publicRoutes = routeUtil.getRoutes([
  acceptInvitation,
  acceptAdminExists,
]);

export default {
  publicRoutes,
};
