import config from 'config';

import EmailService from './email.helper';

// Do not send emails on development env
const apiKey = config.isDev ? '' : config.sendgridApiKey;

const emailService = new EmailService({
  apiKey,
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

export default {
  sentCompanyInvitation,
};
