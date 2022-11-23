import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './pipeline.schema';
import { Pipeline } from './pipeline.types';

const service = db.createService<Pipeline>(DATABASE_DOCUMENTS.PIPELINES, { schema });

export default Object.assign(service, {});
