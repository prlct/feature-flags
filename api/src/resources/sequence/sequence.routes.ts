import { routeUtil } from 'utils';
import sequenceUpdate from './actions/sequence-update';
import getSequences from './actions/get-sequences';
import removeSequence from './actions/remove-sequence';


const privateRoutes = routeUtil.getRoutes([
  sequenceUpdate,
  getSequences,
  removeSequence,
]);

export default {
  privateRoutes,
};
