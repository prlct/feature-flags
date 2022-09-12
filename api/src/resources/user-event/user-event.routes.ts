import { routeUtil } from 'utils';

import createUserEvent from './actions/public-key-api/create';

const publicKeyRoutes = [
  createUserEvent,
];

const externalRoutes = routeUtil.getRoutes([
  ...publicKeyRoutes,
]);

export default {
  externalRoutes,
};
