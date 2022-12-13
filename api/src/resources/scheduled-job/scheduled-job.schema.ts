import Joi from 'joi';

import { ScheduledJobStatus, ScheduledJobType } from './scheduled-job.types';

const scheduledEmailData = Joi.object({
  emailId: Joi.string().required(),
  targetEmail: Joi.string().email().required(),
  pipelineId: Joi.string().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
});


const schema = Joi.object({
  _id: Joi.string().required(),

  applicationId: Joi.string().required(),
  type: Joi.string().valid(...Object.values(ScheduledJobType)).required(),
  data: scheduledEmailData,
  status: Joi.string().valid(...Object.values(ScheduledJobStatus)),
  result: Joi.string().empty(null).default(''),

  scheduledDate: Joi.date().required(),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
