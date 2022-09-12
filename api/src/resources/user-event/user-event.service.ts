import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './user-event.schema';
import { UserEvent } from './user-event.types';

const service = db.createService<UserEvent>(DATABASE_DOCUMENTS.USER_EVENTS, { schema });

export default Object.assign(service, {});
