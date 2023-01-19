import { includes } from 'lodash';
import { AppKoaContext, Next } from 'types';
import { companyService } from 'resources/company';

const companyAuth = async (ctx: AppKoaContext, next: Next) => {
  const { companyId } = ctx.params;
  const company = await companyService.findOne({ _id: companyId });

  if (!company) {
    ctx.status = 404;
    ctx.body = {};
    return null;
  }

  const isAdminHasAccessToCompany = includes(company.adminIds, ctx.state.admin._id);

  if (isAdminHasAccessToCompany) {
    ctx.state.company = company;
    return next();
  }

  ctx.status = 403;
  ctx.body = {};
  return null;
};

export default companyAuth;
