import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './sequence.schema';
import { Sequence } from './sequence.types';

const service = db.createService<Sequence>(DATABASE_DOCUMENTS.SEQUENCES, { schema });

export default Object.assign(service, {});
