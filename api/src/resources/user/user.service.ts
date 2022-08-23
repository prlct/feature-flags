import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './user.schema';
import { User } from './user.types';

const service = db.createService<User>(DATABASE_DOCUMENTS.USERS, { schema });

export default Object.assign(service, {});
