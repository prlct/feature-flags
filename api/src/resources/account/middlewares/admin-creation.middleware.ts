import { securityUtil } from 'utils';
import { PRIVATE_API_KEY_SECURITY_LENGTH, PUBLIC_API_KEY_SECURITY_LENGTH } from 'app.constants';
import { AppKoaContext } from 'types';
import { authService } from 'services';
import { Application, applicationService, Env } from 'resources/application';
import { Admin, adminService } from 'resources/admin';
import { Company, companyService } from 'resources/company';
import slackService from 'services/slack.service';
import mailerLiteService from 'services/mailerlite.service';

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
    if (!admin.oauth) {
      adminChanged = await adminService.updateOne(
        { _id: admin._id },
        (old) => ({ ...old, oauth: { ...old.oauth, ...admin.oauth } }),
      );
    }
    const adminUpdated = adminChanged || admin;
    await Promise.all([
      adminService.updateLastRequest(adminUpdated._id),
      authService.setTokens(ctx, adminUpdated._id),
    ]);

  } else {
    const { newAdmin } = await adminService
      .withTransaction(async (session): Promise<{
        application: Application;
        newAdmin: Admin;
        company: Company
      }> => {
        const createdAdmin = await adminService.insertOne({
          ...authAdminData,
        }, { session });

        const createdCompany = await companyService.insertOne({
          ownerId: createdAdmin._id,
          applicationIds: [],
          adminIds: [createdAdmin._id],
        }, { session });

        const createdApplication = await applicationService.insertOne({
          publicApiKey,
          privateApiKey,
          companyId: createdCompany._id,
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

        await companyService.updateOne(
          { _id: createdCompany._id },
          () => ({ applicationIds: [createdApplication._id] }),
          { session },
        );
        await adminService.updateOne(
          { _id: createdAdmin._id },
          () => ({
            ownCompanyId: createdCompany._id,
            companyIds: [createdCompany._id],
            applicationIds: [createdApplication._id],
          }),
          { session },
        );

        return { newAdmin: createdAdmin, company: createdCompany, application: createdApplication };
      });

    if (newAdmin) {
      await adminService.updateLastRequest(newAdmin._id);
      await authService.setTokens(ctx, newAdmin._id);

      const name = `${newAdmin.firstName} ${newAdmin.lastName}`.trim();

      slackService.send(`${name} just signed up! Reach out by email: ${newAdmin.email}.`);
      mailerLiteService.addOnboardingSubscriber({ email: newAdmin.email, name });
    }
  }
};

export default createAdmin;