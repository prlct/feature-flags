import multer from '@koa/multer';

import config from 'config';
import { cloudStorageService } from 'services';
import { Next, AppKoaContext, AppRouter } from 'types';
import { adminService } from 'resources/admin';

const upload = multer();

const getFileKey = (url: string) => url
  .replace(`https://${config.cloudStorage.bucket}.${config.cloudStorage.endpoint}/`, '');

async function validator(ctx: AppKoaContext, next: Next) {
  const { file } = ctx.request;

  ctx.assertClientError(file, {
    global: 'File cannot be empty',
  });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { admin } = ctx.state;
  const { file } = ctx.request;

  if (admin.avatarUrl) {
    await cloudStorageService.deleteObject(getFileKey(admin.avatarUrl));
  }

  const fileName = `${admin._id}-${Date.now()}-${file.originalname}`;
  const { Location } = await cloudStorageService.uploadPublic(`avatars/${fileName}`, file);

  const updatedAdmin = await adminService.updateOne(
    { _id: admin._id },
    () => ({ avatarUrl: Location }),
  );

  ctx.body = adminService.getPublic(updatedAdmin);
}

export default (router: AppRouter) => {
  router.post('/upload-photo', upload.single('file'), validator, handler);
};
