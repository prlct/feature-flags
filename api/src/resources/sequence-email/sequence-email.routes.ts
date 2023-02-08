import { routeUtil } from 'utils';
import update from './actions/update-sequence-email';
import getSequenceEmails from './actions/get-sequence-emails';
import removeSequenceEmail from './actions/remove-sequence-email';
import toggleEmailEnabled from './actions/toggle-email-enabled';
import sendTestEmail from './actions/send-test-email';
import redirect from './actions/redirect';


const privateRoutes = routeUtil.getRoutes([
  update,
  getSequenceEmails,
  removeSequenceEmail,
  toggleEmailEnabled,
  sendTestEmail,
]);

const publicRoutes = routeUtil.getRoutes([
  redirect,
]);

export default {
  privateRoutes,
  publicRoutes,
};
