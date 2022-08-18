import { AppKoaContext, Next } from 'types';
import { adminService } from 'resources/admin';
import { tokenService } from 'resources/token';

const tryToAttachAdmin = async (ctx: AppKoaContext, next: Next) => {
  let adminData;

  if (ctx.state.accessToken) {
    adminData = await tokenService.findTokenByValue(ctx.state.accessToken);
  }

  if (adminData && adminData.adminId) {
    const admin = await adminService.findOne({ _id: adminData.adminId });

    if (admin) {
      await adminService.updateLastRequest(adminData.adminId);

      ctx.state.admin = admin;
    }
  }

  return next();
};

export default tryToAttachAdmin;
