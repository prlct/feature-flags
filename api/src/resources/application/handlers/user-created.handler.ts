import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { DATABASE_DOCUMENTS } from 'app.constants';

import { User } from 'resources/user';
import applicationService from '../application.service';
import moment from 'moment';
import config from 'config';
import { companyService } from 'resources/company';
import { subscriptionService } from 'resources/subscription';
import { additionalPackageService } from 'resources/additional-package';

const { USERS } = DATABASE_DOCUMENTS;

export const checkMauLimits = async (event: string, data: InMemoryEvent<User>) => {
  const user = data.doc; 

  const application = await applicationService.findOne( { _id: data.doc.applicationId });

  if (!application) return;

  const statistics = await subscriptionService.getMauUsageLimit(data.doc.applicationId);

  const company = await companyService.findOne({ applicationIds: data.doc.applicationId });
  const subscription = company && await subscriptionService.findOne({ companyId: company._id });

  const monthlyActiveUsersLimit = subscription 
    ? subscription.subscriptionLimits.mau : Number(config.MONTHLY_ACTIVE_USERS_LIMIT); 

  if (subscription && monthlyActiveUsersLimit <= (statistics?.count || 0)) {

    const activePackage = await additionalPackageService.atomic.findOneAndUpdate(
      { 
        customer: company.stripeId as string,
        unusedMau: { $gt: 0 },
        periodEnd: { $gte: moment().toDate() }, 
      },
      { $inc: { unusedMau: -1 } },
    );

    if (!activePackage?.value || activePackage?.value?.unusedMau <= 1) {
      await additionalPackageService.createPaymentForAdditionalPackage(company);
    }
  } 

  if (!subscription && monthlyActiveUsersLimit <= (statistics?.count || 0)) {
    companyService.atomic.updateOne(
      { _id: company?._id },
      {
        $set: { freeLimitUsed: true },    
      },
    );
  }

  if (event === 'users.created') {
    const usersCount = application.envs[user.env].totalUsersCount;
    await applicationService.atomic.updateOne(
      { _id: application._id },
      { $set: { [`envs.${[user.env]}.totalUsersCount`]: usersCount + 1 } },
    );
  }  
};

eventBus.on(`${USERS}.created`, async (data: InMemoryEvent<User>) => {
  checkMauLimits(`${USERS}.created`, data);
});