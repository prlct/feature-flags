import { routeUtil } from 'utils';

import getCurrent from './actions/get-current';
import removeAvatar from './actions/remove-avatar';
import uploadAvatar from './actions/upload-avatar';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([
  getCurrent,
  removeAvatar,
  uploadAvatar,
]);

export default {
  publicRoutes,
  privateRoutes,
};
