import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';
import moment from 'moment';

import { ScheduledJob, ScheduledJobStatus, ScheduledJobType } from 'resources/scheduled-job/scheduled-job.types';
import schema from 'resources/scheduled-job/scheduled-job.schema';
import { SequenceEmail } from 'resources/sequence-email/sequence-email.types';
import sequenceService from 'resources/sequence/sequence.service';


const service = db.createService<ScheduledJob>(DATABASE_DOCUMENTS.SCHEDULED_JOBS, { schema });

const scheduleSequenceEmail = async (sequenceEmail: SequenceEmail, email: string, extraDelayMillis = 0) => {
  const scheduledDate = moment()
    .add(sequenceEmail.delayDays, 'days')
    .add(extraDelayMillis, 'milliseconds')
    .toDate();
  const sequence = await sequenceService.findOne({
    _id: sequenceEmail.sequenceId,
    enabled: true,
    deletedOn: { $exists: false },
  });

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

const rescheduleSendingSequenceEmail = async (_id: string, scheduled: Date, extraDelay: number) => {
  const newScheduledDate = moment(scheduled)
    .add(extraDelay, 'day')
    .toDate();

  await service.atomic.updateOne({
    _id,
  }, {
    $set: { scheduledDate: newScheduledDate },
  });
};

const scheduleDelayedCheck = async (lastJob: ScheduledJob) => {
  const scheduledDate = moment()
    .add(3, 'days')
    .toDate();

  const job = {
    applicationId: lastJob.applicationId,
    type: ScheduledJobType.DELAYED_CHECK,
    data: {
      emailId: lastJob.data.emailId,
      targetEmail: lastJob.data.targetEmail,
      pipelineId: lastJob.data.pipelineId,
    },
    status: ScheduledJobStatus.PENDING,
    scheduledDate,
  };

  await service.insertOne(job);
};

export default Object.assign({ scheduleSequenceEmail, rescheduleSendingSequenceEmail, scheduleDelayedCheck }, service);
