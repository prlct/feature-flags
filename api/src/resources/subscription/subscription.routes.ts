import { routeUtil } from 'utils';

import getCurrent from './actions/get-current';
import subscribe from './actions/subscribe';
import previewUpgrade from './actions/preview-upgrade';
import upgrade from './actions/upgrade';
import cancel from './actions/cancel';
import additionalPackage from './actions/additional-package';

const privateRoutes = routeUtil.getRoutes([
  getCurrent,
  subscribe,
  previewUpgrade,
  upgrade,
  cancel,
  additionalPackage,
]);

export default {
  privateRoutes,
};
