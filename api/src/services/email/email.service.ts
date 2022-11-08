import { join } from 'lodash';

import config from 'config';
import EmailService from './email.helper';
import { adminService } from 'resources/admin';

// Do not send emails on development env
const apiKey = config.isDev ? '' : config.sendgridApiKey;

const emailService = new EmailService({
  apiKey,
  templatesDir: join(__dirname, '../../assets/emails/dist'),
  from: {
    email: 'team@growthflags.com',
    name: 'GrowthFlags',
  },
});

const sentCompanyInvitation = (
  to: string,
  dynamicTemplateData: { [key: string]: unknown; },
) => emailService.sendSendgridTemplate({
  to,
  templateId: 'd-d4aef0ea033349a4a2c5c6da5071b181',
  dynamicTemplateData,
});
// TODO: change email template
const sendSuccessfulSubscription = async (data: any) => {
  return emailService.sendTemplate({
    to: data.customer_email,
    subject: 'Your subscription confirmation',
    template: 'subscription-confirmation.html',
    dynamicTemplateData: {},
  });
};

const sendSubscriptionDeleted = async (data: any) => {
  const admin = await adminService.findOne({ stripeId: data.customer });
  if (!admin?.email) return null;

  return emailService.sendTemplate({
    to: admin?.email,
    subject: 'Your subscription deleted',
    template: 'subscription-deleted.html',
    dynamicTemplateData: {},
  });
};

export default {
  sentCompanyInvitation,
  sendSuccessfulSubscription,
  sendSubscriptionDeleted,
};
