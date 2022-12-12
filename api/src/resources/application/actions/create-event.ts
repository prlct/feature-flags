import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';


import applicationAuth from '../middlewares/application-auth.middleware';
import applicationService from '../application.service';

const schema = Joi.object({
  label: Joi.string().required(),
  value: Joi.string().required(),
});

type ValidatedData = {
  label: string,
  value: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { label, value } = ctx.validatedData;
  const { applicationId } = ctx.params;

  ctx.body = await applicationService.atomic.updateOne({
    _id: applicationId,
  }, { $addToSet: { events: { label, value } } });
};

export default (router: AppRouter) => {
  router.post('/:applicationId/events', applicationAuth, validateMiddleware(schema), handler);
};
