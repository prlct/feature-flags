import { AppKoaContext, AppRouter } from 'types';
import { sequenceEmailService } from '../index';

const handler = async (ctx: AppKoaContext) => {
  const { sequenceEmailId, url } = ctx.params;

  await sequenceEmailService.atomic.updateOne({ _id: sequenceEmailId }, { $inc: { clicked: 1 } });

  ctx.redirect(url);
  ctx.body = 'redirecting...';
};

export default (router: AppRouter) => {
  router.get('/:sequenceEmailId/redirect/:url', handler);
};
