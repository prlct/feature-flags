import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './company.schema';
import { Company } from './company.types';

const service = db.createService<Company>(DATABASE_DOCUMENTS.COMPANIES, { schema });

export default Object.assign(service, {});
