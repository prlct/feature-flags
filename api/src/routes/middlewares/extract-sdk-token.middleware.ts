import { AppKoaContext, Next } from 'types';

const storeTokenToState = async (ctx: AppKoaContext, next: Next) => {
  const { authorization } = ctx.headers;

  if (authorization) {
    const sdkAccessToken = authorization.replace('Bearer', '').trim();
    ctx.state.sdkAccessToken = sdkAccessToken;
  }

  await next();
};

export default storeTokenToState;
