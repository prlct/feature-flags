import config from 'config';
import { cloudStorageService } from 'services';
import { AppKoaContext, Next, AppRouter } from 'types';
import { adminService } from 'resources/admin';

const getFileKey = (url: string) => url
  .replace(`https://${config.cloudStorage.bucket}.${config.cloudStorage.endpoint}/`, '');

async function validator(ctx: AppKoaContext, next: Next) {
  const { admin } = ctx.state;

  ctx.assertClientError(admin.avatarUrl, {
    global: 'You don\'t have avatar',
  });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { admin } = ctx.state;

  await Promise.all([
    cloudStorageService.deleteObject(getFileKey(admin.avatarUrl || '')),
    adminService.updateOne({ _id: admin._id }, () => ({ avatarUrl: null })),
  ]);

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete('/remove-photo', validator, handler);
};
