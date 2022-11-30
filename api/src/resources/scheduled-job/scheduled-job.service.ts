import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import { ScheduledJob } from 'resources/scheduled-job/scheduled-job.types';
import schema from 'resources/scheduled-job/scheduled-job.schema';

const service = db.createService<ScheduledJob>(DATABASE_DOCUMENTS.SCHEDULED_JOBS, { schema });

export default Object.assign({}, service);
