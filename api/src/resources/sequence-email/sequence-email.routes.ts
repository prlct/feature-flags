import { routeUtil } from 'utils';
import update from './actions/update-sequence-email';
import getSequenceEmails from './actions/get-sequence-emails';
import removeSequenceEmail from './actions/remove-sequence-email';
import toggleEmailEnabled from './actions/toggle-email-enabled';


const privateRoutes = routeUtil.getRoutes([
  update,
  getSequenceEmails,
  removeSequenceEmail,
  toggleEmailEnabled,
]);

export default {
  privateRoutes,
};
