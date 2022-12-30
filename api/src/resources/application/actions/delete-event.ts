import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';


import applicationAuth from '../middlewares/application-auth.middleware';
import applicationService from '../application.service';
import sequenceService from 'resources/sequence/sequence.service';

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

  const { results } = await sequenceService.find({
    applicationId,
    'trigger.name': label,
    'trigger.eventKey': value,
    deletedOn: { $exists: false },
  });
 
  if (results.length) {
    ctx.throwClientError({ sequence: 'Trigger event is used in one of the sequence' });
    return;
  }

  ctx.body = await applicationService.atomic.updateOne({
    _id: applicationId,
  }, { $pull: { events: { label, value } } });
};

export default (router: AppRouter) => {
  router.delete('/:applicationId/events', applicationAuth, validateMiddleware(schema), handler);
};
