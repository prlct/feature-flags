import { routeUtil } from 'utils';
import update from './actions/update-sequence-email';
import getSequenceEmails from './actions/get-sequence-emails';


const privateRoutes = routeUtil.getRoutes([
  update,
  getSequenceEmails,
]);

export default {
  privateRoutes,
};
