import { routeUtil } from 'utils';
import getPipelineUsers from './actions/get-pipeline-users';

const privateRoutes = routeUtil.getRoutes([
  getPipelineUsers,
]);

export default {
  privateRoutes,
};
