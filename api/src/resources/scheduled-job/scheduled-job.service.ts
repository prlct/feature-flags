import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';
import moment from 'moment';

import { ScheduledJob, ScheduledJobStatus, ScheduledJobType } from 'resources/scheduled-job/scheduled-job.types';
import schema from 'resources/scheduled-job/scheduled-job.schema';
import { SequenceEmail } from 'resources/sequence-email/sequence-email.types';
import sequenceService from '../sequence/sequence.service';


const service = db.createService<ScheduledJob>(DATABASE_DOCUMENTS.SCHEDULED_JOBS, { schema });

const addEmailSend = async (sequenceEmail: SequenceEmail, email: string) => {
  const scheduledDate = moment().add(sequenceEmail.delayDays, 'days').toDate();
  const sequence = await sequenceService.findOne({ _id: sequenceEmail.sequenceId, deletedOn: { $exists: false } });

  if (!sequence) {
    return;
  }

  const job = {
    applicationId: sequenceEmail.applicationId,
    type: ScheduledJobType.EMAIL_SEQUENCE_SEND,
    data: {
      emailId: sequenceEmail._id,
      targetEmail: email,
      pipelineId: sequence.pipelineId,
    },
    status: ScheduledJobStatus.PENDING,
    scheduledDate,
  };
  await service.insertOne(job);
};

const addEmailsSend = async (sequenceEmails: SequenceEmail[], email: string) => {

  const sequence = await sequenceService.findOne({ _id: sequenceEmails[0].sequenceId, deletedOn: { $exists: false } });

  if (!sequence) {
    return;
  }

  const jobs = sequenceEmails.map((sequenceEmail, index) => (
    {
      applicationId: sequenceEmail.applicationId,
      type: ScheduledJobType.EMAIL_SEQUENCE_SEND,
      data: {
        emailId: sequenceEmail._id,
        targetEmail: email,
        pipelineId: sequence.pipelineId,
      },
      status: ScheduledJobStatus.PENDING,
      scheduledDate: moment().add(Math.max(10, 10 * index), 'seconds').add(sequenceEmail.delayDays, 'days').toDate(),
    }
  ));

  await service.insertMany(jobs);
};

export default Object.assign({ addEmailSend, addEmailsSend }, service);
