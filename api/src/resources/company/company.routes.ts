import { routeUtil } from 'utils';

import getMember from './actions/get-members';
import inviteMember from './actions/invite-member';
import cancelInvitation from './actions/cancel-invitation';
import removeMember from './actions/remove-member';
import updateMemberPermissions from './actions/update-member-permissions';

const privateRoutes = routeUtil.getRoutes([
  getMember,
  inviteMember,
  cancelInvitation,
  removeMember,
  updateMemberPermissions,
]);

export default {
  privateRoutes,
};
