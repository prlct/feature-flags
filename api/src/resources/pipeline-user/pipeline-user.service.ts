import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './pipeline-user.schema';
import { PipelineUser } from './pipeline-user.types';

const service = db.createService<PipelineUser>(DATABASE_DOCUMENTS.PIPELINE_USERS, { schema });

export default Object.assign(service, {});
