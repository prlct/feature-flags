import { routeUtil } from 'utils';

import signUp from './actions/sign-up';
import signIn from './actions/sign-in';
import signOut from './actions/sign-out';
import google from './actions/google';
import github from './actions/github';
import shadowLogin from './actions/shadow-login';

const publicRoutes = routeUtil.getRoutes([
  signUp,
  signIn,
  signOut,
  google,
  github,
]);

const adminRoutes = routeUtil.getRoutes([
  shadowLogin,
]);

export default {
  publicRoutes,
  adminRoutes,
};
