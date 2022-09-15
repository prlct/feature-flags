import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { DATABASE_DOCUMENTS } from 'app.constants';

import { UserEvent, UserEventType, userEventService } from 'resources/user-event';
import featureService from '../feature.service';

const { USER_EVENTS } = DATABASE_DOCUMENTS;

eventBus.on(`${USER_EVENTS}.created`, async (data: InMemoryEvent<UserEvent>) => {
  const userEvent  = data.doc;

  if (userEvent.type !== UserEventType.FeatureViewed || !userEvent?.data?.featureId) return;

  const { userId, env, data: { featureId } } = userEvent;
  const feature = await featureService.findOne({ _id: featureId });

  if (!feature) return;

  const featureViewedEvents = await userEventService.find({ 
    userId,
    'data.featureId': featureId, 
    createdOn: { 
      $gt: feature.envSettings[env].visibilityChangedOn, 
    }, 
  });

  if (featureViewedEvents.count > 1) return;
 
  const usersCount = feature.envSettings[env].usersViewedCount;
  await featureService.atomic.updateOne(
    { _id: feature._id },
    { $set: { [`envSettings.${[env]}.usersViewedCount`]: usersCount + 1 } },
  );
});
