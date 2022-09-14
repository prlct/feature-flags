import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { DATABASE_DOCUMENTS } from 'app.constants';

import { UserEvent, UserEventType } from 'resources/user-event';
import applicationService from '../application.service';

const { USER_EVENTS } = DATABASE_DOCUMENTS;

eventBus.on(`${USER_EVENTS}.created`, async (data: InMemoryEvent<UserEvent>) => {
  const userEvent = data.doc;
  
  if (userEvent.type !== UserEventType.FeatureViewed) return;

  const application = await applicationService.findOne( { _id: userEvent.applicationId });

  if (!application || application.trackEnabled) return;

  await applicationService.atomic.updateOne(
    { _id: application._id },
    { $set: { trackEnabled: true } },
  );
});
