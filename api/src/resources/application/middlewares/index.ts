import applicationAuth from './application-auth.middleware';
import privateTokenAuth from './private-token-auth.middleware';
import publicTokenAuth from './public-token-auth.middleware';
import extractTokenFromQuery from './exract-query-token.middleware';

export {
  applicationAuth,
  privateTokenAuth,
  publicTokenAuth,
  extractTokenFromQuery,
};