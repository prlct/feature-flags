import db from 'db';

import { DATABASE_DOCUMENTS } from 'app.constants';

import { UnsubscribeToken } from './unsubscribe-token.types';
import schema from './unsubscribe-token.schema';

const service = db.createService<UnsubscribeToken>(DATABASE_DOCUMENTS.UNSUBSCRIBE_TOKENS, { schema });

export default Object.assign(service, {});
