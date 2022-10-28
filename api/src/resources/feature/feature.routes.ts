import { routeUtil } from 'utils';

import deleteFeature from './actions/delete-feature';
import updateDescription from './actions/update-description';
import updateRemoteConfig from './actions/update-remote-config';
import toggle from './actions/toggle';
import changeVisibility from './actions/change-visibility';
import changeUsersPercentage from './actions/change-users-percentage';
import getCurrent from './actions/get-current';
import updateTargetingRules from './actions/update-targeting-rules';

import getFeatures from './actions/private-key-api/get-features';
import changeEnabled from './actions/private-key-api/change-enabled';
import getFeaturesForUserPublicKey from './actions/public-key-api/get-features-for-user';
import createAbVariant from './actions/create-ab-variant';
import updateAbVariant from './actions/update-ab-variant';
import removeAbVariant from './actions/remove-ab-variant';
import getHistory from './actions/get-history';

const privateRoutes = routeUtil.getRoutes([
  deleteFeature,
  updateDescription,
  updateRemoteConfig,
  toggle,
  changeVisibility,
  changeUsersPercentage,
  getCurrent,
  updateTargetingRules,
  createAbVariant,
  updateAbVariant,
  removeAbVariant,
  getHistory,
]);

const privateKeyRoutes = [
  getFeatures,
  changeEnabled,
];

const publicKeyRoutes = [
  getFeaturesForUserPublicKey,
];

const externalRoutes = routeUtil.getRoutes([
  ...privateKeyRoutes,
  ...publicKeyRoutes,
]);

export default {
  privateRoutes,
  externalRoutes,
};
