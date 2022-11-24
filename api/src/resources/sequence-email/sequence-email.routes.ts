import { routeUtil } from 'utils';
import update from './actions/update-sequence-email';


const privateRoutes = routeUtil.getRoutes([
  update,
]);

export default {
  privateRoutes,
};
