import { routeUtil } from 'utils';

import createUser from './actions/public-key-api/create';

const publicKeyRoutes = [
  createUser,
];

const externalRoutes = routeUtil.getRoutes([
  ...publicKeyRoutes,
]);

export default {
  externalRoutes,
};
