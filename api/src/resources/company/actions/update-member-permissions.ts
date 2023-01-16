import Joi from 'joi';
import _ from 'lodash';

import { AppKoaContext, Next, AppRouter } from 'types';
import { adminService } from 'resources/admin';
import { validateMiddleware } from 'middlewares';
import { permissionsMiddlewareMiddleware } from 'resources/application/middlewares';

import companyAuth from '../middlewares/company-auth.middleware';

const schema = Joi.object({
  enabledPermissions: Joi.array().items(Joi.string().trim()),
});

async function validator(ctx: AppKoaContext, next: Next) {
  const { companyId, memberId } = ctx.params;
  const { admin } = ctx.state;

  const isAdminCompanyOwner = admin.ownCompanyId === companyId;

  ctx.assertClientError(isAdminCompanyOwner, {
    global: 'Only company owner can remove members',
  });

  const isAdminExists = await adminService.exists({ _id: memberId });

  ctx.assertClientError(isAdminExists, {
    global: 'Member does not exists',
  });

  await next();
}

type ValidatedData = {
  enabledPermissions: string[];
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { companyId, memberId } = ctx.params;
  const { enabledPermissions } = ctx.validatedData;
  const newPermissions = _.mapValues({
    manageSenderEmails: false,
    managePayments: false,
    manageMembers: false,
  }, (value, key) => _.includes(enabledPermissions, key));

  await adminService.updateOne({ _id: memberId }, (doc) => {
    doc.permissions[companyId] = newPermissions;
    return doc;
  });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.put(
    '/:companyId/members/:memberId/permissions',
    companyAuth,
    permissionsMiddlewareMiddleware(['manageMembers']),
    validateMiddleware(schema),
    validator,
    handler,
  );
};
