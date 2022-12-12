import { routeUtil } from 'utils';
import getPipelineUsers from './actions/get-pipeline-users';
import removeFromPipeline from './actions/remove-from-pipeline';

const privateRoutes = routeUtil.getRoutes([
  getPipelineUsers,
  removeFromPipeline,
]);

export default {
  privateRoutes,
};
