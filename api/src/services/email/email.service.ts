import Stripe from 'stripe';

import config from 'config';
import EmailService from './email.helper';
import { adminService } from 'resources/admin';
import { getPlanInformation } from '../stripe/stripe.helper';

// Do not send emails on development env
const apiKey = config.isDev ? '' : config.sendgridApiKey;

const emailService = new EmailService({
  apiKey,
  from: {
    email: 'team@growthflags.com',
    name: 'GrowthFlags',
  },
});

const emailAlternativeService = new EmailService({
  apiKey,
  from: {
    email: 'evgeniy@growthflags.com',
    name: 'Evgeniy Sergeiev (GrowthFlags)',
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

const sendSuccessfulSubscription = async (data: any) => {
  const admin = await adminService.findOne({ stripeId: data.customer });

  if (!admin) {
    return; 
  }

  const planInfo = await getPlanInformation(data.plan.product as string);

  if (!planInfo) {
    return; 
  }

  return emailAlternativeService.sendSendgridTemplate({
    to: admin.email as string,
    templateId: 'd-c07d368901f6464399b1692ba6e84ff3',
    dynamicTemplateData: planInfo,
  });
};

const sendSubscriptionDeleted = async (data: any) => {
  const admin = await adminService.findOne({ stripeId: data.customer });
  if (!admin?.email) return null;


  return emailAlternativeService.sendSendgridTemplate({
    to: admin?.email,
    templateId: 'd-727429f6db814a3e81da32e9dbacdd9d',
    dynamicTemplateData: {},
  });
};

const sendRenewalReminder = async (data: Stripe.Invoice) => {
  if (!data.customer_email && !data.subscription) {
    return;
  }

  return emailAlternativeService.sendSendgridTemplate({
    to: data.customer_email as string,
    templateId: 'd-d3d9bcc9e3d04e2f8f17471e37190ad4',
    dynamicTemplateData: { },
  });
};

export default {
  sentCompanyInvitation,
  sendSuccessfulSubscription,
  sendSubscriptionDeleted,
  sendRenewalReminder,
};
