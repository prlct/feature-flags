import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './statistics.schema';
import { Statistics } from './statistics.types';

const service = db.createService<Statistics>(DATABASE_DOCUMENTS.STATISTICS, { schema });

export default Object.assign(service, {});
