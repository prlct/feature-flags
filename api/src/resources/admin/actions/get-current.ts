import { AppKoaContext, AppRouter } from 'types';
import { adminService } from 'resources/admin';

async function handler(ctx: AppKoaContext) {
  ctx.body = adminService.getPublic(ctx.state.admin);
}

export default (router: AppRouter) => {
  router.get('/current', handler);
};
