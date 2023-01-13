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

const rescheduleSendingSequenceEmail = async (_id: string, scheduled: Date, extraDelay = 0) => {
  const newScheduledDate = moment(scheduled)
    .add(extraDelay, 'day')
    .toDate();

  await service.atomic.updateOne({
    _id,
  }, {
    $set: { scheduledDate: newScheduledDate },    
  });
};

export default Object.assign({ scheduleSequenceEmail, rescheduleSendingSequenceEmail }, service);
