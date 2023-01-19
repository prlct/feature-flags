import { AppKoaContext, AppRouter } from 'types';
import { adminService } from 'resources/admin';
import companyAuth from 'resources/company/middlewares/company-auth.middleware';
import type { Company } from 'resources/company';


async function handler(ctx: AppKoaContext) {
  const company = ctx.state.company as Company;

  const admin = await adminService.updateOne({ _id: ctx.state.admin._id }, (doc) => {
    doc.currentCompany = {
      _id: company._id,
      name: company.name,
    };
    doc.currentApplicationId = company.applicationIds[0];
    return doc;
  });

  ctx.body = adminService.getPublic(admin);
}

export default (router: AppRouter) => {
  router.put('/company/:companyId', companyAuth, handler);
};
