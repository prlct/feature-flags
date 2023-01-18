import { AppKoaContext, AppRouter } from 'types';

import { validateMiddleware } from 'middlewares';
import Joi from 'joi';
import emailsSendingAnalyticsService from '../emails-sending-analytics.service';
import moment from 'moment';
import { companyService } from 'resources/company';
import { subscriptionService } from 'resources/subscription';
import config from 'config';

const schema = Joi.object({
  companyId: Joi.string().required(),
});

type ValidatedData = {
  companyId: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { companyId } = ctx.validatedData;

  const today = moment().format('YYYY/MM/DD');
  const daysInMonth = 30;

  const company = await companyService.findOne({ _id: companyId });
  const subscription = company && await subscriptionService.findOne({ companyId: company._id });

  const sendingEmails = await emailsSendingAnalyticsService.findOne({ 
    companyId, 
    adminId: company?.ownerId,
    [`sendingEmails.${today}`]: { $exists: true },
  });

  let dailyEmailsLimit = Math.floor(Number(config.MONTHLY_EMAILS_LIMIT) / daysInMonth);

  if (subscription) {
    const monthlyEmailsLimit = subscription.subscriptionLimits.emails || 1; 
    dailyEmailsLimit = Math.floor(monthlyEmailsLimit / daysInMonth) || 1;
  }

  let usagePercentage = 0;

  if (sendingEmails?.sendingEmails[today]) {
    usagePercentage = Math.floor((sendingEmails?.sendingEmails[today] / dailyEmailsLimit) * 100);
  } 

  ctx.body = {
    usagePercentage,
    dailyEmailsLimit,
    limitReached: dailyEmailsLimit < (sendingEmails?.sendingEmails[today] || 0),
    sendingEmailsToday: sendingEmails?.sendingEmails[today],
  };
};

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), handler);
};