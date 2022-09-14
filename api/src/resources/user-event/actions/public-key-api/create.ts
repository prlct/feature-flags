import Joi from 'joi';

import { validateMiddleware, extractTokenFromHeader } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { publicTokenAuth } from 'resources/application/middlewares';
import userEventService from '../../user-event.service';
import { UserEventType } from '../../user-event.types';
import { featureValidation } from '../../middlewares';
import userService from 'resources/user/user.service';

const schema = Joi.object({
  userId: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(UserEventType))
    .required(),
  data: Joi.object({
    featureName: Joi.string(),
  })
    .when('type', {
      is: UserEventType.FeatureViewed,
      then: Joi.object({ featureName: Joi.required() }).required(),
    }),
});

type ValidatedData = {
  userId: string;
  type: UserEventType;
  data: {
    featureName?: string
  }
};

type EventData = {
  featureName?: string,
  featureId?: string
}; 

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { application, feature } = ctx.state;
  const { userId, type, data } = ctx.validatedData;

  const user = await userService.findOne({ _id: userId });

  let eventData: EventData = data;
  
  if (feature) {
    if (!eventData) {
      eventData = {};
    }
    eventData.featureId = feature._id;
    eventData.featureName = feature.name;
  }
  
  const userEvent = await userEventService.insertOne({
    userId, 
    type, 
    applicationId: application._id,
    env: user?.env,
    data: eventData,
  });

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
