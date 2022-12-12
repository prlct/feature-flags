import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import { ScheduledJob, ScheduledJobStatus, ScheduledJobType } from 'resources/scheduled-job/scheduled-job.types';
import schema from 'resources/scheduled-job/scheduled-job.schema';

import { SequenceEmail } from '../sequence-email/sequence-email.types';
import moment from 'moment';

const service = db.createService<ScheduledJob>(DATABASE_DOCUMENTS.SCHEDULED_JOBS, { schema });

const addEmailSend = async (sequenceEmail: SequenceEmail, email: string) => {
  const scheduledDate = moment().add(10, 'seconds').toDate();
  const job = {
    applicationId: sequenceEmail.applicationId,
    type: ScheduledJobType.EMAIL_SEQUENCE_SEND,
    data: {
      emailId: sequenceEmail._id,
      targetEmail: email,
    },
    status: ScheduledJobStatus.PENDING,
    scheduledDate,
  };
  await service.insertOne(job);
};

const addEmailsSend = async (sequenceEmails: SequenceEmail[], email: string) => {

  const jobs = sequenceEmails.map((sequenceEmail) => (
    {
      applicationId: sequenceEmail.applicationId,
      type: ScheduledJobType.EMAIL_SEQUENCE_SEND,
      data: {
        emailId: sequenceEmail._id,
        targetEmail: email,
      },
      status: ScheduledJobStatus.PENDING,
      scheduledDate: moment().add(sequenceEmail.delayDays, 'days').toDate(),
    }
  ));

  await service.insertMany(jobs);
};

export default Object.assign({ addEmailSend, addEmailsSend }, service);
