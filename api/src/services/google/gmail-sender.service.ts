import { google } from 'googleapis';
import config from 'config';
import { parse } from 'node-html-parser';

import applicationService from 'resources/application/application.service';
import { SequenceEmail } from 'resources/sequence-email/sequence-email.types';
import sequenceService from 'resources/sequence/sequence.service';


type MailOptions = {
  to: string,
  subject: string,
  text: string,
};

const replaceLinks = async (htmlString: string, emailId: string) => {
  const parsed = parse(htmlString);
  const links = parsed.getElementsByTagName('a');

  links.forEach((link) => {
    const href = link.getAttribute('href') as string;
    const encodedOriginalLink = encodeURIComponent(href);
    const newLink = `${config.apiUrl}/sequence-emails/${emailId}/redirect/${encodedOriginalLink}`;
    link.setAttribute('href', newLink);
  });

  return parsed.toString();
};

const encodeEmail = (str: string) => Buffer.from(str)
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

const addUnsubscribeLink = (text: string, token: string) => {
  const link = `${config.webUrl}/unsubscribe/${token}`;
  const a = `<div style="margin-top: 20px"><a href="${link}" target="_blank" referrerpolicy="no-referrer" style="font-size: 10px; color: gray; ">Unsubscribe</a></div>`;
  return `<div><div>${text}</div>${a}</div>`;
};

const encodeEmailString = (mailOptions: MailOptions, from: string) => {
  const encodedSubject = Buffer.from(mailOptions.subject).toString('base64');
  return ['Content-Type: text/html; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    'Content-Transfer-Encoding: 7bit\n',
    'to: ', mailOptions.to, '\n',
    'from: ', from, '\n',
    'subject: ', `=?utf-8?B?${encodedSubject}?=`, '\n\n',
    mailOptions.text,
  ].join('');
};

export const buildEmail = async (
  sequenceEmail: SequenceEmail,
  to: string,
  token = '',
  firstName?: string,
  lastName?: string,
) => {
  let text = sequenceEmail.body;
  if (sequenceEmail.allowRedirect) {
    text = await replaceLinks(sequenceEmail.body, sequenceEmail._id);
  }

  if (token) {
    text = addUnsubscribeLink(sequenceEmail.body, token);
  }

  return { subject: sequenceEmail.subject, text, to }; // fixme - add firstName, lastName
};

export const sendEmail = async (sequenceEmail: SequenceEmail, appId: string, to: string, token = '') => {
  try {
    const oAuth2Client = new google.auth.OAuth2(config.gmail);

    const app = await applicationService.findOne({ _id: appId });
    const sequence = await sequenceService.findOne({ _id: sequenceEmail.sequenceId });
    const from = sequence?.trigger?.senderEmail;

    if (!from) {
      return;
    }

    if (!app?.gmailCredentials?.[from]) {
      return;
    }

    oAuth2Client
      .setCredentials({
        refresh_token:
        app.gmailCredentials[from].refreshToken,
      });

    const gmail = google.gmail('v1');

    const mailOptions = await buildEmail(sequenceEmail, to, token);

    const str = encodeEmailString(mailOptions, from);
    const encodedMail = encodeEmail(str);

    await gmail.users.messages.send({
      auth: oAuth2Client,
      userId: 'me',
      requestBody: { raw: encodedMail },
    });
  } catch (error) {
    console.error(`Failed to send email ${sequenceEmail._id}, app id ${appId} to ${to}`);
  }
};

export const getRedirectUrl = async (applicationId: string, state: string) => {
  const oAuth2Client = new google.auth.OAuth2(config.gmail);
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    client_id: config.gmail.clientId,
    scope: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/userinfo.email'],
    state,
  });

  return url;
};
