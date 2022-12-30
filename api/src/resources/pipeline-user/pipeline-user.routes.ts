import { routeUtil } from 'utils';
import getPipelineUsers from './actions/get-pipeline-users';
import removeFromPipeline from './actions/remove-from-pipeline';
import updatePipelineUser from './actions/update-pipeline-user';

const privateRoutes = routeUtil.getRoutes([
  getPipelineUsers,
  removeFromPipeline,
  updatePipelineUser,
]);

export default {
  privateRoutes,
};
