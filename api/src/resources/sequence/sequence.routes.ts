import { routeUtil } from 'utils';
import sequenceUpdate from './actions/sequence-update';
import getSequences from './actions/get-sequences';
import triggerUpdate from './actions/trigger-update';
import removeSequence from './actions/remove-sequence';


const privateRoutes = routeUtil.getRoutes([
  sequenceUpdate,
  getSequences,
  triggerUpdate,
  removeSequence,
]);

export default {
  privateRoutes,
};
