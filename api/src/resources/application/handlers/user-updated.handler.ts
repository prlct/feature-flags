import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import ioEmitter from 'io-emitter';
import { DATABASE_DOCUMENTS } from 'app.constants';

import { User } from 'resources/user';
import moment from 'moment';
import { checkMauLimits } from './user-created.handler';

const { USERS } = DATABASE_DOCUMENTS;

eventBus.on(`${USERS}.updated`, async (data: InMemoryEvent<User>) => {
  const user = data.prevDoc;

  const startOfMonth = moment().startOf('month').toDate();

  if (user?.lastVisitedOn && user?.lastVisitedOn > startOfMonth) return;

  checkMauLimits(`${USERS}.updated`, data);
});