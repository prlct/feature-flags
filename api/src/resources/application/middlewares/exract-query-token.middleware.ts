import { AppKoaContext, Next } from 'types';

const extractTokenFromQuery = (ctx: AppKoaContext, next: Next) => {
  if (ctx.state.accessToken) {
    return next();
  }

  const { token } = ctx.query;

  if (Array.isArray(token)) {
    return next();
  }

  if (token) {
    ctx.state.accessToken = token;
  }

  return next();
};

export default extractTokenFromQuery;
