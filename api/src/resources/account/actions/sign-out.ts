import { Magic } from '@magic-sdk/admin';
import { authService } from 'services';
import { AppKoaContext, AppRouter } from 'types';
import config from 'config';

const magic = new Magic(config.MAGIC_SECRET_KEY);

const handler = async (ctx: AppKoaContext) => {
  // TODO: Add TTL index for auth tokens
  await Promise.all([
    await authService.unsetTokens(ctx),
    await magic.users.logoutByIssuer(ctx.state.admin.issuer),
  ]);

  ctx.body = {};
};

export default (router: AppRouter) => {
  router.post('/sign-out', handler);
};
