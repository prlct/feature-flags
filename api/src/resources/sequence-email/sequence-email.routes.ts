import { routeUtil } from 'utils';

import createSequenceEmail from './actions/create-sequence-email';

const privateRoutes = routeUtil.getRoutes([
  createSequenceEmail,
]);

export default {
  privateRoutes,
};
