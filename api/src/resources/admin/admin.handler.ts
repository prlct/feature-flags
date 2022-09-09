import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

// import ioEmitter from 'io-emitter';
import { DATABASE_DOCUMENTS } from 'app.constants';

import { Admin } from './admin.types';
import adminService from './admin.service';

const { ADMINS } = DATABASE_DOCUMENTS;

eventBus.on(`${ADMINS}.updated`, (data: InMemoryEvent<Admin>) => {
  const admin = data.doc;

  // ioEmitter.publishToAdmin(admin._id, 'admin:updated', admin);
});

// eventBus.onUpdated(ADMINS, ['firstName', 'lastName'], async (data: InMemoryEvent<Admin>) => {
//   await adminService.atomic.updateOne(
//     { _id: data.doc._id },
//     { $set: { fullName: `${data.doc.firstName} ${data.doc.lastName}` } },
//   );
// });
