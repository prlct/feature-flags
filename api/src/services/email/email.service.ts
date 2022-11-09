import { join } from 'lodash';
import dayjs from 'dayjs';
import Stripe from 'stripe';

import config from 'config';
import EmailService from './email.helper';
import { adminService } from 'resources/admin';
import stripe from 'services/stripe/stripe.service';

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
const sendSuccessfulSubscription = async (data: Stripe.Invoice) => {
  if (!data.customer_email && !data.subscription) {
    return;
  }
  const subscription = await stripe.subscriptions.retrieve(data.subscription as string) as any;

  const endDate = dayjs((new Date(subscription.current_period_end * 1000))).format('MMM DD, YYYY');
  const price = `${subscription.plan.amount / 100} ${subscription.plan.currency.toUpperCase()}/${subscription.plan.interval}`;

  return emailService.sendTemplate({
    to: data.customer_email as string,
    subject: 'Your subscription confirmation',
    template: 'subscription-confirmation.html',
    dynamicTemplateData: { endDate, price },
  });
};

const sendSubscriptionDeleted = async (data: any) => {
  const admin = await adminService.findOne({ stripeId: data.customer });
  if (!admin?.email) return null;

  const endDate = dayjs((new Date(data.current_period_end * 1000))).format('MMM DD, YYYY');

  return emailService.sendTemplate({
    to: admin?.email,
    subject: 'Your subscription deleted',
    template: 'subscription-deleted.html',
    dynamicTemplateData: { endDate },
  });
};

const sendRenewalReminder = async (data: Stripe.Invoice) => {
  if (!data.customer_email && !data.subscription) {
    return;
  }
  const subscription = await stripe.subscriptions.retrieve(data.subscription as string) as any;

  const endDate = dayjs((new Date(subscription.current_period_end * 1000))).format('MMM DD, YYYY');
  const price = `${subscription.plan.amount / 100} ${subscription.plan.currency.toUpperCase()}/${subscription.plan.interval}`;

  return emailService.sendTemplate({
    to: data.customer_email as string,
    subject: 'Your access to Growthflags expires in 7 days',
    template: 'subscription-renewal_reminder.html',
    dynamicTemplateData: { endDate, price },
  });
};

export default {
  sentCompanyInvitation,
  sendSuccessfulSubscription,
  sendSubscriptionDeleted,
  sendRenewalReminder,
};
