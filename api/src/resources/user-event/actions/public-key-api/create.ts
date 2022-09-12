import Joi from 'joi';

import { validateMiddleware, extractTokenFromHeader } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import userEventService from '../../user-event.service';
import { publicTokenAuth } from 'resources/application/middlewares';
import { EventType } from '../../user-event.types';
import { featureValidation } from '../../middlewares';

const schema = Joi.object({
  userId: Joi.string().required(),
  event: Joi.string()
    .valid(...Object.values(EventType))
    .required(),
  data: Joi.object({
    featureName: Joi.string(),
  })
    .when('event', {
      is: EventType.FeatureViewed,
      then: Joi.object({ featureName: Joi.required() }).required(),
    }),
});

type ValidatedData = {
  userId: string,
  event: EventType,
  data: {
    featureName?: string
  }
};

type EventData = {
  featureName?: string,
  featureId?: string
}; 

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { feature } = ctx.state;
  const { userId, event, data } = ctx.validatedData;

  let eventData: EventData = data;
  
  if (feature) {
    if (!eventData) {
      eventData = {};
    }
    eventData.featureId = feature._id;
    eventData.featureName = feature.name;
  }
  
  const userEvent = await userEventService.insertOne({ userId, event, data: eventData });

  ctx.body = userEvent;
}

export default (router: AppRouter) => {
  router.post(
    '/',  
    extractTokenFromHeader, 
    publicTokenAuth,
    validateMiddleware(schema), 
    featureValidation, 
    handler,
  );
};
