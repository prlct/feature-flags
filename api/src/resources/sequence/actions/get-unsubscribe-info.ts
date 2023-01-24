import Joi from 'joi';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { unsubscribeTokenService } from 'resources/unsubscribe-token';

const schema = Joi.object({
  token: Joi.string().trim().required(),
});

type ValidatedData = {
  token: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { token } = ctx.validatedData;

  const tokenInfo = await unsubscribeTokenService.findOne({ value: token });

  if (!tokenInfo) {
    ctx.throwClientError({ token: 'Invalid token' }, 404);
  }

  ctx.body = tokenInfo;
};

export default (router: AppRouter) => {
  router.get('/get-unsubscribe-info/:token', validateMiddleware(schema), handler);
};
