import Joi from 'joi';
import { google } from 'googleapis';

import { AppKoaContext, AppRouter } from 'types';
import config from 'config';
import { validateMiddleware } from 'middlewares';
import applicationService from '../application.service';

const scheme = Joi.object({
  state: Joi.string().required(),
  code: Joi.string().required(),
});

type ValidatedData = {
  state: string,
  code: string,
};

const resultHandler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { state, code } = ctx.validatedData;
  const cookieState = ctx.cookies.get('gmail-add-state');

  if (cookieState !== state) {
    ctx.throw(403, 'Invalid State');
    return;
  }

  const appId = ctx.cookies.get('appId');

  const oAuth2Client = new google.auth.OAuth2(config.gmail);
  const { tokens } = await oAuth2Client.getToken(code);

  if (!tokens?.access_token || !tokens?.refresh_token) {
    ctx.throw(403, 'No tokens');
    return;
  }

  const { access_token: accessToken, refresh_token: refreshToken } = tokens;

  const { email } = await oAuth2Client.getTokenInfo(accessToken);
  if (!email) {
    ctx.throw(403, 'No email');
    return;
  }

  await applicationService.updateOne({ _id: appId }, (doc) => {
    doc.gmailCredentials = { ...doc.gmailCredentials, [email]: { refreshToken, accessToken } };
    return doc;
  });

  ctx.body = 'ok';
};

export default (router: AppRouter) => {
  router.get('/add-gmail', validateMiddleware(scheme), resultHandler);
};
