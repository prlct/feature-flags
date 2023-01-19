import applicationAuth from './application-auth.middleware';
import privateTokenAuth from './private-token-auth.middleware';
import publicTokenAuth from './public-token-auth.middleware';
import extractTokenFromQuery from './exract-query-token.middleware';
import permissionsMiddleware from './permissionMiddleware.middleware';

export {
  applicationAuth,
  privateTokenAuth,
  publicTokenAuth,
  extractTokenFromQuery,
  permissionsMiddleware,
};
