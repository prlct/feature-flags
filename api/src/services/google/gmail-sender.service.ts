import { google } from 'googleapis';
import config from 'config';

import applicationService from 'resources/application/application.service';
import { SequenceEmail } from 'resources/sequence-email/sequence-email.types';


type MailOptions = {
  to: string,
  subject: string,
  text: string,
};

const encodeEmail = (str: string) => Buffer.from(str)
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

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
  firstName?: string,
  lastName?: string,
) => {
  return { subject: sequenceEmail.subject, text: sequenceEmail.body }; // fixme
};

export const sendEmail = async (appId: string, mailOptions: MailOptions) => {
  try {
    const oAuth2Client = new google.auth.OAuth2(config.gmail);

    const app = await applicationService.findOne({ _id: appId });

    if (!app?.gmailCredentials?.[0]) {
      return;
    }

    oAuth2Client
      .setCredentials({
        refresh_token:
          app.gmailCredentials[0].refreshToken,
      });

    const gmail = google.gmail('v1');

    const from = app.gmailCredentials[0].email;

    const str = encodeEmailString(mailOptions, from);
    const encodedMail = encodeEmail(str);

    await gmail.users.messages.send({
      auth: oAuth2Client,
      userId: 'me',
      requestBody: { raw: encodedMail },
    });
  } catch (error) {
    console.error(error);
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
