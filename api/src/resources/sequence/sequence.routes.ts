import { routeUtil } from 'utils';
import sequenceUpdate from './actions/sequence-update';
import getSequences from './actions/get-sequences';
import triggerUpdate from './actions/trigger-update';


const privateRoutes = routeUtil.getRoutes([
  sequenceUpdate,
  getSequences,
  triggerUpdate,
]);

export default {
  privateRoutes,
};
