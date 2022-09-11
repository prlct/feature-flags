import { AppKoaContext, Next } from 'types';

const storeTokenToState = async (ctx: AppKoaContext, next: Next) => {
  const { authorization } = ctx.headers;

  if (authorization) {
    const accessToken = authorization.replace('Bearer', '').trim();
    ctx.state.accessToken = accessToken;
  }

  await next();
};

export default storeTokenToState;
