import { AppKoaContext, AppRouter } from 'types';
import { applicationService } from 'resources/application';
import applicationAuth from '../middlewares/application-auth.middleware';

async function handler(ctx: AppKoaContext) {
  const { applicationId } = ctx.params;
  const application = await applicationService.findOne({ _id: applicationId });

  ctx.body = application;
}

export default (router: AppRouter) => {
  router.get('/:applicationId', applicationAuth, handler);
};
