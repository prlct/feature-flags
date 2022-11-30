import scheduledJobService from './scheduled-job.service';
import moment from 'moment';
import schedule, { Job } from 'node-schedule';
import { ScheduledJob, ScheduledJobStatus, ScheduledJobType } from './scheduled-job.types';
import logger from 'logger';

export const todayScheduledJobs = {
  current: [] as Job[],
};

const getHandler = (job: ScheduledJob) => {
  switch (job.type) {
    case ScheduledJobType.EMAIL_SEQUENCE_SEND: {

      return async () => {
        try {
          logger.info(`Starting job ${job._id}`);
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
