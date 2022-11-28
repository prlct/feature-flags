import { routeUtil } from 'utils';
import update from './actions/update-sequence-email';
import getSequenceEmails from './actions/get-sequence-emails';
import removeSequenceEmail from './actions/remove-sequence-email';


const privateRoutes = routeUtil.getRoutes([
  update,
  getSequenceEmails,
  removeSequenceEmail,
]);

export default {
  privateRoutes,
};
