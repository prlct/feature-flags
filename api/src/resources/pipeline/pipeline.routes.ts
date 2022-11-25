import { routeUtil } from 'utils';
import update from './actions/pipeline-update';
import getPipelines from './actions/get-pipelines';

const privateRoutes = routeUtil.getRoutes([
  update,
  getPipelines,
]);

export default {
  privateRoutes,
};
