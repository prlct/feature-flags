import { COOKIES } from 'app.constants';
import { AppKoaContext, Next } from 'types';

const storeTokenToState = async (ctx: AppKoaContext, next: Next) => {
  const accessToken = ctx.cookies.get(COOKIES.ACCESS_TOKEN);

  if (accessToken) {
    ctx.state.accessToken = accessToken;
  }

  await next();
};

export default storeTokenToState;
