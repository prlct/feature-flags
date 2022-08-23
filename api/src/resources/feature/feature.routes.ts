import { routeUtil } from 'utils';

import toggle from './actions/toggle';
import changeVisibility from './actions/change-visibility';
import changeUsersPercentage from './actions/change-users-percentage';
import getCurrent from './actions/get-current';
import enableForUsers from './actions/enable-for-users';
import disableForUsers from './actions/disable-for-users';

const privateRoutes = routeUtil.getRoutes([
  toggle,
  changeVisibility,
  changeUsersPercentage,
  getCurrent,
  enableForUsers,
  disableForUsers,
]);

export default {
  privateRoutes,
};
