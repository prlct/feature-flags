import sendgrid from '@sendgrid/mail';
import path from 'path';
import fs from 'fs/promises';
import handlebars from 'handlebars';

type From = {
  email: string,
  name: string,
};

interface MailServiceConstructor {
  apiKey: string,
  templatesDir: string,
  from: From
}

interface SendSendgridTemplate {
  to: string,
  templateId: string,
  dynamicTemplateData: { [key: string]: unknown; }
}

interface SendTemplate {
  to: string,
  subject: string,
  template: string,
  dynamicTemplateData: { [key: string]: unknown; }
}

const render = async (templatePath: string, templateParams: unknown) => {
  const template = await fs.readFile(templatePath);
  const compiledHtml = handlebars.compile(template.toString());

  return compiledHtml(templateParams);
};

class MailService {
  apiKey: string;

  templatesDir: string;

  from: From;

  constructor({
    apiKey,
    templatesDir,
    from,
  }: MailServiceConstructor) {
    this.apiKey = apiKey;
    this.from = from;
    this.templatesDir = templatesDir;

    sendgrid.setApiKey(apiKey);
  }

  async sendSendgridTemplate({
    to,
    templateId,
    dynamicTemplateData,
  }: SendSendgridTemplate) {
    if (!this.apiKey) {
      console.log('Email not sent because of development environment', {
        to,
        templateId,
        dynamicTemplateData,
      });

      return null;
    }

    return sendgrid.send({
      to,
      from: this.from,
      templateId,
      dynamicTemplateData,
    });
  }

  async sendTemplate({
    to,
    subject,
    template,
    dynamicTemplateData,
  }: SendTemplate) {
    if (!this.apiKey) {
      console.log('Email not sent because of development environment', {
        to,
        subject,
        template,
        dynamicTemplateData,
      });

      return null;
    }

    const templatePath = path.join(this.templatesDir, template);
    const html = await render(templatePath, dynamicTemplateData);

    return sendgrid.send({
      to,
      from: this.from,
      subject,
      html,
      dynamicTemplateData,
    });
  }
}

export default MailService;
