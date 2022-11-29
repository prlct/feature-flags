import sendgrid from '@sendgrid/mail';

type From = {
  email: string,
  name: string,
};

interface MailServiceConstructor {
  apiKey: string,
  from: From
}

interface SendSendgridTemplate {
  to: string,
  templateId: string,
  dynamicTemplateData: { [key: string]: unknown; }
  from?: From,
}

class MailService {
  apiKey: string;

  from: From;

  constructor({
    apiKey,
    from,
  }: MailServiceConstructor) {
    this.apiKey = apiKey;
    this.from = from;

    sendgrid.setApiKey(apiKey);
  }

  async sendSendgridTemplate({
    from,
    to,
    templateId,
    dynamicTemplateData,
  }: SendSendgridTemplate) {
    if (!this.apiKey) {
      console.log('Email not sent because of development environment', {
        from: from || this.from,
        to,
        templateId,
        dynamicTemplateData,
      });

      return null;
    }

    return sendgrid.send({
      to,
      from: from || this.from,
      templateId,
      dynamicTemplateData,
    });
  }
}

export default MailService;
