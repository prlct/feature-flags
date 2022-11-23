import { routeUtil } from 'utils';

import createPipeline from './actions/create-pipeline';

const privateRoutes = routeUtil.getRoutes([
  createPipeline,
]);

export default {
  privateRoutes,
};
