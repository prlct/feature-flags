import cron from 'scheduler/cron';
import { loadJobs } from 'resources/scheduled-job/scheduled-job.handler';

cron.on('cron:every-day', loadJobs);
