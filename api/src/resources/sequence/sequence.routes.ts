import { routeUtil } from 'utils';

import createSequence from './actions/create-sequence';

const privateRoutes = routeUtil.getRoutes([
  createSequence,
]);

export default {
  privateRoutes,
};
