import Joi from 'joi';
import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import applicationAuth from '../middlewares/application-auth.middleware';
import applicationService from '../application.service';
import sequenceService from 'resources/sequence/sequence.service';

const schema = Joi.object({
  updatedEvent: Joi.object({
    label: Joi.string(),
    value: Joi.string(),
  }),
  event: Joi.object({
    label: Joi.string(),
    value: Joi.string(),
  }),
  
});

type DataItem = {
  label: string,
  value: string,
};

type ValidatedData = {
  updatedEvent: DataItem,
  event: DataItem,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { updatedEvent, event } = ctx.validatedData;
  const { applicationId } = ctx.params;

  await sequenceService.atomic.updateMany({
    applicationId,
    'trigger.eventKey': event.value,
  }, { $set: { 'trigger.eventKey': updatedEvent.value } });
  
  ctx.body = await applicationService.atomic.updateOne({
    _id: applicationId,
    'events.label': event.label,
    'events.value': event.value,
  }, { 
    $set: { 
      'events.$.label': updatedEvent.label,  
      'events.$.value': updatedEvent.value, 
    }, 
  });

};

export default (router: AppRouter) => {
  router.put('/:applicationId/events', applicationAuth, validateMiddleware(schema), handler);
};
