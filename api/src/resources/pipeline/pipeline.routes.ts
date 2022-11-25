import { routeUtil } from 'utils';
import getPipelines from './actions/get-pipelines';


const privateRoutes = routeUtil.getRoutes([
  getPipelines,
]);

export default {
  privateRoutes,
};
