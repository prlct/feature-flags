import { AppKoaContext, AppRouter } from 'types';
import { subscriptionService } from 'resources/subscription';
import { companyService } from 'resources/company';

async function handler(ctx: AppKoaContext) {
  const { companyIds } = ctx.state.admin;

  const company = await companyService.findOne({ _id: companyIds[0] });

  if (company?._id) {
    const subscription = await subscriptionService.findOne({ companyId: company._id });
    ctx.body = subscription;

    return;
  }

  ctx.body = null;
}

export default (router: AppRouter) => {
  router.get('/current', handler);
};
