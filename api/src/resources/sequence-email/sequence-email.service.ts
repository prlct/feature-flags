import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './sequence-email.schema';
import { SequenceEmail } from './sequence-email.types';

const service = db.createService<SequenceEmail>(DATABASE_DOCUMENTS.SEQUENCE_EMAILS, { schema });

export default Object.assign(service, {});
