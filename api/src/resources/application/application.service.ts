import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './application.schema';
import { Application } from './application.types';

const service = db.createService<Application>(DATABASE_DOCUMENTS.APPLICATIONS, { schema });

export default Object.assign(service, {});
