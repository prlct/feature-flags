import _ from 'lodash';

import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './admin.schema';
import { Admin } from './admin.types';

const service = db.createService<Admin>(DATABASE_DOCUMENTS.ADMINS, { schema });

const updateLastRequest = (_id: string) => service.atomic.updateOne(
  { _id },
  {
    $set: {
      lastRequestOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    },
  },
);

const updateLastLogin = (_id: string, timestamp: number) => service.atomic.updateOne(
  { _id },
  {
    $set: {
      lastRequestOn: new Date().toISOString(),
      lastLoginOn: new Date(timestamp).toISOString(),
      updatedOn: new Date().toISOString(),
    },
  },
);

const privateFields = [
  'passwordHash',
  'signupToken',
  'resetPasswordToken',
];

const getPublic = (admin: Admin | null) => _.omit(admin, privateFields);

export default Object.assign(service, {
  updateLastRequest,
  updateLastLogin,
  getPublic,
});
