import { routeUtil } from 'utils';
import sequenceUpdate from './actions/sequence-update';


const privateRoutes = routeUtil.getRoutes([
  sequenceUpdate,
]);

export default {
  privateRoutes,
};
