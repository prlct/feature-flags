import { routeUtil } from 'utils';
import update from './actions/pipeline-update';
import getPipelines from './actions/get-pipelines';
import removePipeline from './actions/remove-pipeline';

const privateRoutes = routeUtil.getRoutes([
  update,
  getPipelines,
  removePipeline,
]);

export default {
  privateRoutes,
};
