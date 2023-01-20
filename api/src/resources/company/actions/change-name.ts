import Joi from 'joi';

import { companyService } from 'resources/company';
import { AppKoaContext, AppRouter, Next } from 'types';
import validateMiddleware from 'middlewares/validate.middleware';
import companyAuth from 'resources/company/middlewares/company-auth.middleware';
import { adminService } from 'resources/admin';

const schema = Joi.object({
  name: Joi.string().trim().min(1).max(255),
});

type ValidatedData = {
  name: string;
};

const validator = async (ctx: AppKoaContext, next: Next) => {
  if (ctx.state.admin.ownCompanyId === ctx.state.company?._id) {
    return next();
  }

  ctx.throwClientError({ global: 'Only company owner can change name' }, 403);
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { name } = ctx.validatedData;
  const { companyId } = ctx.params;

  const company = await companyService.updateOne({ _id: companyId }, (doc) => {
    doc.name = name;
    return doc;
  });

  await adminService.updateMany({ 'currentCompany._id': companyId }, (doc) => {
    doc.currentCompany.name = name;
    doc.companies = doc.companies.map((c) => {
      if (c._id === companyId) {
        return { ...c, name };
      }
      return c;
    });
    return doc;
  });

  ctx.body = company;
};

export default (router: AppRouter) => {
  router.put('/:companyId/name', validateMiddleware(schema), companyAuth, validator, handler);
};
