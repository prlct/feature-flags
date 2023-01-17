import { routeUtil } from 'utils';

import getCurrent from './actions/get-current';
import removeAvatar from './actions/remove-avatar';
import uploadAvatar from './actions/upload-avatar';
import changeCurrentCompany from './actions/change-current-company';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([
  getCurrent,
  changeCurrentCompany,
  removeAvatar,
  uploadAvatar,
]);

export default {
  publicRoutes,
  privateRoutes,
};
