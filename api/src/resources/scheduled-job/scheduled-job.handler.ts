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

export const todayScheduledJobs = {
  current: [] as Job[],
};

const getHandler = (job: ScheduledJob) => {
  switch (job.type) {
    case ScheduledJobType.EMAIL_SEQUENCE_SEND: {

      return async () => {
        try {
          const email = await sequenceEmailService.findOne({ _id: job.data.emailId });
          const app = await applicationService.findOne({ _id: job.applicationId });
          if (!app?.gmailCredentials) {
            throw new Error('Application not found or no gmail credentials provided');
          }
          if (!email) {
            throw new Error('Sequence email not found');
          }
          const builtEmail = await buildEmail(email);
          await sendEmail(
            job.applicationId,
            { ...builtEmail, to: job.data.targetEmail, from: app.gmailCredentials.email },
          );

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

  todayScheduledJobs.current = jobsToday.map((jobInDB) => {
    return schedule.scheduleJob(jobInDB.scheduledDate, getHandler(jobInDB));
  });

  logger.debug(`Loaded ${todayScheduledJobs.current.length} scheduled jobs for today`);
};

eventBus.on(
  `${DATABASE_DOCUMENTS.SCHEDULED_JOBS}.created`,
  async (data: InMemoryEvent<ScheduledJob>) => {
    const scheduledJob = schedule.scheduleJob(data.doc.scheduledDate, getHandler(data.doc));
    todayScheduledJobs.current.push(scheduledJob);
  },
);
