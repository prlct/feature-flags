import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import ioEmitter from 'io-emitter';
import { DATABASE_DOCUMENTS } from 'app.constants';

import { User } from 'resources/user';
import applicationService from '../application.service';

const { USERS } = DATABASE_DOCUMENTS;

eventBus.on(`${USERS}.created`, async (data: InMemoryEvent<User>) => {
  const user = data.doc;

  const application = await applicationService.findOne( { _id: data.doc.applicationId });

  if (!application) return;

  const usersCount = application.envs[user.env].totalUsersCount;
  await applicationService.atomic.updateOne(
    { _id: application._id },
    { $set: { [`envs.${[user.env]}.totalUsersCount`]: usersCount + 1 } },
  );
});