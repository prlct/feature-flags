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

  const application = await applicationService.find({
    _id: applicationId,
    'events.value': { $ne: value },
    'events.label': { $ne: label },
  });
  console.log(application);

  if (!application.count) {
    ctx.throwClientError({ event: 'Name and key must be unique' });
    return;
  }

  ctx.body = await applicationService.atomic.updateOne(
    {
      _id: applicationId,
    },
    { $push: { events: { label, value } } },
  );
};

export default (router: AppRouter) => {
  router.post('/:applicationId/events', applicationAuth, validateMiddleware(schema), handler);
};
