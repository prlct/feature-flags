import { routeUtil } from 'utils';

import signUp from './actions/sign-up';
import signIn from './actions/sign-in';
import signOut from './actions/sign-out';

const publicRoutes = routeUtil.getRoutes([
  signUp,
  signIn,
  signOut,
]);

export default {
  publicRoutes,
};
