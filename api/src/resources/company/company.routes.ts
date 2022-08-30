import { routeUtil } from 'utils';

import getMember from './actions/get-members';
import inviteMember from './actions/invite-member';

const privateRoutes = routeUtil.getRoutes([
  getMember,
  inviteMember,
]);

export default {
  privateRoutes,
};
