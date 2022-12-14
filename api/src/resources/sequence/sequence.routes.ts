import { routeUtil } from 'utils';
import sequenceUpdate from './actions/sequence-update';
import getSequences from './actions/get-sequences';
import triggerUpdate from './actions/trigger-update';
import removeSequence from './actions/remove-sequence';
import toggleSequenceEnabled from './actions/toggle-sequence-enabled';


const privateRoutes = routeUtil.getRoutes([
  sequenceUpdate,
  getSequences,
  triggerUpdate,
  removeSequence,
  toggleSequenceEnabled,
]);

export default {
  privateRoutes,
};
