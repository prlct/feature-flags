import type { AppKoaContext, Next } from 'types';
import applicationService from '../application.service';

const publicTokenAuth = async (ctx: AppKoaContext, next: Next) => {
  if (!ctx.state.accessToken) {
    ctx.status = 401;
    ctx.body = {};
    return null;
  }

  const application = await applicationService.findOne({ publicApiKey: ctx.state.accessToken });

  if (application) {
    ctx.state.application = application;
    return next();
  }

  ctx.status = 403;
  ctx.body = {};
  return null;
};

export default publicTokenAuth;
