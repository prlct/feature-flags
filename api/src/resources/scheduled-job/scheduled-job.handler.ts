import scheduledJobService from './scheduled-job.service';
import moment from 'moment';
import schedule, { Job } from 'node-schedule';
import logger from 'logger';
import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { buildEmail, sendEmail } from 'services/google/gmail-sender.service';
import sequenceEmailService from 'resources/sequence-email/sequence-email.service';

import { ScheduledJob, ScheduledJobStatus, ScheduledJobType } from './scheduled-job.types';
import applicationService from 'resources/application/application.service';
import { DATABASE_DOCUMENTS } from 'app.constants';
import pipelineUserService from '../pipeline-user/pipeline-user.service';
import sequenceService from '../sequence/sequence.service';

export const todayScheduledJobs = {
  current: [] as Job[],
};

const getHandler = (job: ScheduledJob) => {
  switch (job.type) {
    case ScheduledJobType.EMAIL_SEQUENCE_SEND: {

      return async () => {
        try {
          const email = await sequenceEmailService.findOne({
            _id: job.data.emailId,
            enabled: true,
            deletedOn: { $exists: false },
          });

          if (!email) {
            throw new Error(`Sequence email not found or was disabled: ${job.data.emailId}`);
          }

          const sequence = await sequenceService.findOne({
            _id: email.sequenceId,
            enabled: true,
            deletedOn: { $exists: false },
          });

          if (!sequence) {
            throw new Error('Sequence not found or was removed');
          }

          const app = await applicationService.findOne({ _id: job.applicationId });

          if (!app?.gmailCredentials?.[0]) {
            throw new Error('Application not found or no gmail credentials provided');
          }

          const builtEmail = await buildEmail(email);
          await sendEmail(
            job.applicationId,
            { ...builtEmail, to: job.data.targetEmail },
          );

          const { results: emails } = await sequenceEmailService.find({
            sequenceId: email.sequenceId,
            enabled: true,
            deletedOn: { $exists: false },
          });

          const nextEmail = emails.find((m) => moment(m.createdOn).isAfter(moment(email.createdOn)));

          if (nextEmail) {
            await scheduledJobService.addEmailSend(nextEmail, job.data.targetEmail);
          } else {
            // todo: next sequence?
          }

          await pipelineUserService.atomic.updateOne({
            'pipeline._id': job.data.pipelineId,
            deletedOn: { $exists: false },
          }, {
            $set: {
              'sequence.lastEmailId': job.data.emailId,
              'sequence.pendingEmailId': nextEmail?._id || null,
            },
          });

          await sequenceEmailService.atomic.updateOne({ _id: job.data.emailId }, {  $inc: { sent: 1 } });
          await scheduledJobService.updateOne({ _id: job._id }, (doc) => {
            return { ...doc, status: ScheduledJobStatus.COMPLETED, result: 'Email sent.' };
          });
        } catch (error) {
          let message = 'unknown';
          if (error instanceof Error) {
            message = error.message;
          }

          await scheduledJobService.atomic.updateOne({ _id: job._id }, {
            $set: {
              status: ScheduledJobStatus.FAILED,
              result: `Execute failed: ${message}`,
            },
          });
        }
      };
    }
    default:
      return () => logger.warn(`No-op operation set for scheduled job id: [${job._id}] type: [${job.type}]`);
  }
};

export const loadJobs = async () => {
  const today = moment().startOf('day');
  const tomorrow = moment().endOf('day');

  const { results: jobsToday } = await scheduledJobService.find({
    deletedOn: { $exists: false },
    status: ScheduledJobStatus.PENDING,
    scheduledDate: {
      $gte: today.toDate(),
      $lte: tomorrow.toDate(),
    },
  });

  todayScheduledJobs.current = jobsToday.reduce((acc, jobInDB) => {
    if (moment(jobInDB.scheduledDate).isBefore(new Date())) {
      getHandler(jobInDB)();
      return acc;
    }
    return [...acc, schedule.scheduleJob(jobInDB.scheduledDate, getHandler(jobInDB))];
  }, [] as Job[]);

  logger.debug(`Loaded ${todayScheduledJobs.current.length} scheduled jobs for today`);
};

eventBus.on(
  `${DATABASE_DOCUMENTS.SCHEDULED_JOBS}.created`,
  async (data: InMemoryEvent<ScheduledJob>) => {
    if (moment(data.doc.scheduledDate).isSame(new Date(), 'day')) {
      if (moment(data.doc.scheduledDate).isBefore(new Date())) {
        getHandler(data.doc)();
      }
      const scheduledJob = schedule.scheduleJob(data.doc.scheduledDate, getHandler(data.doc));
      todayScheduledJobs.current.push(scheduledJob);
    }
  },
);
