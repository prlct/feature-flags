import { routeUtil } from 'utils';

import toggle from './actions/toggle';
import changeVisibility from './actions/change-visibility';
import changeUsersPercentage from './actions/change-users-percentage';
import getCurrent from './actions/get-current';
import enableForUsers from './actions/enable-for-users';
import disableForUsers from './actions/disable-for-users';

import getFeatures from './actions/private-key-api/get-features';
import changeEnabled from './actions/private-key-api/change-enabled';
import addUsers from './actions/private-key-api/add-users';
import removeUsers from './actions/private-key-api/remove-users';

import getFeaturesPublicKey from './actions/public-key-api/get-features';

const privateRoutes = routeUtil.getRoutes([
  toggle,
  changeVisibility,
  changeUsersPercentage,
  getCurrent,
  enableForUsers,
  disableForUsers,
]);

const privateKeyRoutes = [
  getFeatures,
  changeEnabled,
  addUsers,
  removeUsers,
];

const publicKeyRoutes = [
  getFeaturesPublicKey,
];

const externalRoutes = routeUtil.getRoutes([
  ...privateKeyRoutes,
  ...publicKeyRoutes,
]);

export default {
  privateRoutes,
  externalRoutes,
};
