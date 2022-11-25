import { routeUtil } from 'utils';
import sequenceUpdate from './actions/sequence-update';
import getSequences from './actions/get-sequences';


const privateRoutes = routeUtil.getRoutes([
  sequenceUpdate,
  getSequences,
]);

export default {
  privateRoutes,
};
