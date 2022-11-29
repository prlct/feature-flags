import scheduledJobService from './scheduled-job.service';
import moment from 'moment';
import schedule from 'node-schedule';
import { ScheduledJob, ScheduledJobStatus, ScheduledJobType } from './scheduled-job.types';
import logger from 'logger';

let todayScheduledJobs;

const getHandler = (job: ScheduledJob) => {
  switch (job.type) {
    case ScheduledJobType.EMAIL_SEQUENCE_SEND: {

      return async () => {
        logger.info(`Starting job ${job._id}`);
        await scheduledJobService.updateOne({ _id: job._id }, (doc) => {
          return { ...doc, status: ScheduledJobStatus.COMPLETED };
        });
      };
    }
    default:
      return () => logger.warn(`No-op operation set for scheduled job id: [${job._id}] type: [${job.type}]`);
  }
};

const onLoad = async () => {
  const today = moment().startOf('day');
  const tomorrow = moment().endOf('day');

  const { results: jobsToday } = await scheduledJobService.find({
    deletedOn: { $exists: false },
    status: ScheduledJobStatus.PENDING,
    scheduledDate: {
      $gte: today.toDate(),
      $lt: tomorrow.toDate(),
    },
  });

  todayScheduledJobs = jobsToday.map((jobInDB) => {
    const job = schedule.scheduleJob(jobInDB.scheduledDate, getHandler(jobInDB));
    return job;
  });

  logger.debug(`Loaded ${todayScheduledJobs.length} scheduled jobs for today`);
};

onLoad();
