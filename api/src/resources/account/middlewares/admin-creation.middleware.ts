import { generateId } from '@paralect/node-mongo';

import { securityUtil } from 'utils';
import { PRIVATE_API_KEY_SECURITY_LENGTH, PUBLIC_API_KEY_SECURITY_LENGTH } from 'app.constants';
import { AppKoaContext } from 'types';
import { authService } from 'services';
import { applicationService, Env } from 'resources/application';
import { Admin, adminService } from 'resources/admin';
import { companyService } from 'resources/company';
import slackService from 'services/slack.service';
import mailerLiteService from 'services/mailerlite.service';
import amplitudeService from 'services/amplitude/amplitude.service';

const createAdmin = async (ctx: AppKoaContext) => {

  const { admin, authAdminData } = ctx.state;
  let adminChanged;

  const publicApiKey = 'pk_' + securityUtil.generateSecureToken(PUBLIC_API_KEY_SECURITY_LENGTH);
  const privateApiKey = 'sk_' + securityUtil.generateSecureToken(PRIVATE_API_KEY_SECURITY_LENGTH);

  const isKeysExist = await applicationService.exists({ $or: [{ publicApiKey }, { privateApiKey }] });

  ctx.assertClientError(!isKeysExist, {
    global: 'Keys generation error. Please try again',
  });

  if (admin) {
    adminChanged = await adminService.updateOne(
      { _id: admin._id },
      (old) => ({ ...old, oauth: { ...old.oauth, ...admin.oauth } }),
    );

    const adminUpdated = adminChanged || admin;
    await Promise.all([
      adminService.updateLastRequest(adminUpdated._id),
      authService.setTokens(ctx, adminUpdated._id),
    ]);

  } else {
    const adminId = generateId();
    const applicationId = generateId();
    const companyId = generateId();

    const { newAdmin } = await adminService
      .withTransaction(async (session): Promise<{
        newAdmin: Admin;
      }> => {
        const createdAdmin = await adminService.insertOne({
          _id: adminId,
          ...authAdminData,
          ownCompanyId: companyId,
          companyIds: [companyId],
          applicationIds: [applicationId],
          currentCompany: {
            _id: companyId,
            name: authAdminData.email,
          },
          currentApplicationId: applicationId,
          permissions: {
            companyId: {
              manageMembers: true,
              managePayments: true,
              manageSenderEmails: true,
            },
          },
        }, { session });

        await companyService.insertOne({
          _id: companyId,
          ownerId: adminId,
          applicationIds: [applicationId],
          adminIds: [adminId],
          name: authAdminData.email,
        }, { session });

        await applicationService.insertOne({
          _id: applicationId,
          publicApiKey,
          privateApiKey,
          companyId: companyId,
          featureIds: [],
          envs: {
            [Env.DEVELOPMENT]: {
              totalUsersCount: 0,
            },
            [Env.STAGING]: {
              totalUsersCount: 0,
            },
            [Env.DEMO]: {
              totalUsersCount: 0,
            },
            [Env.PRODUCTION]: {
              totalUsersCount: 0,
            },
          },
        }, { session });
        return { newAdmin: createdAdmin };
      });

    if (newAdmin) {
      await Promise.all([
        adminService.updateLastRequest(newAdmin._id),
        authService.setTokens(ctx, newAdmin._id),
      ]);
      const name = `${newAdmin.firstName} ${newAdmin.lastName}`.trim();
      const method = Object.keys(ctx.state.authAdminData?.oauth || {})[0];
      amplitudeService.trackEvent(newAdmin._id, 'Admin sign up', { method });
      slackService.send(`${name} just signed up! Reach out by email: ${newAdmin.email}.`);
      mailerLiteService.addOnboardingSubscriber({ email: newAdmin.email, name });
    }
  }
};

export default createAdmin;
