import Joi from 'joi';
import { google } from 'googleapis';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';

import applicationService from 'resources/application/application.service';
import applicationAuthMiddleware from 'resources/application/middlewares/application-auth.middleware';
import config from 'config';
import { permissionsMiddleware } from '../middlewares';

const scheme = Joi.object({
  email: Joi.string().email().required(),
  applicationId: Joi.string().required(),
});

type ValidatedData = {
  email: string,
  applicationId: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { email, applicationId } = ctx.validatedData;
  const application = await applicationService.findOne({ _id: applicationId });
  const credentials = application?.gmailCredentials?.[email];

  if (!credentials) {
    return;
  }
  try {
    const oAuth2Client = new google.auth.OAuth2(config.gmail);
    oAuth2Client.setCredentials({ refresh_token: credentials.refreshToken });
    await oAuth2Client.revokeToken(credentials.refreshToken);
  } finally {
    await applicationService.updateOne({ _id: applicationId }, (doc) => {
      delete doc.gmailCredentials?.[email];
      return doc;
    });
    ctx.body = 'ok';
  }
};

export default (router: AppRouter) => {
  router.delete(
    '/:applicationId/sender-emails',
    applicationAuthMiddleware,
    validateMiddleware(scheme),
    permissionsMiddleware(['manageSenderEmails']),
    handler,
  );
};
