import scheduledJobService from './scheduled-job.service';
import moment from 'moment';
import schedule, { Job } from 'node-schedule';
import logger from 'logger';
import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { sendEmail } from 'services/google/gmail-sender.service';
import sequenceEmailService from 'resources/sequence-email/sequence-email.service';

import { ScheduledJob, ScheduledJobStatus, ScheduledJobType } from './scheduled-job.types';
import applicationService from 'resources/application/application.service';
import { DATABASE_DOCUMENTS } from 'app.constants';
import pipelineUserService from '../pipeline-user/pipeline-user.service';
import sequenceService from '../sequence/sequence.service';

export const todayScheduledJobs = {
  current: [] as Job[],
};

const failJob = async (jobId: string, reason: string) => {
  return scheduledJobService.atomic.updateOne({ _id: jobId }, {
    $set: {
      status: ScheduledJobStatus.FAILED,
      result: `Execute failed: ${reason}`,
    },
  });
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
            return await failJob(job._id, `Sequence email not found or was disabled: ${job.data.emailId}`);
          }

          const sequence = await sequenceService.findOne({
            _id: email.sequenceId,
            enabled: true,
            deletedOn: { $exists: false },
          });

          if (!sequence) {
            return await failJob(job._id, 'Sequence not found or was removed');
          }

          const user = await pipelineUserService.findOne({
            'sequences._id': email.sequenceId,
            'pipelines._id': sequence?.pipelineId,
            email: job.data.targetEmail,
            deletedOn: { $exists: false },
          });

          if (!user || user.sequences.find((seq) => seq._id === email.sequenceId)?.finishedOn) {
            return await failJob(job._id, 'User not found or was removed from pipeline');
          }

          const app = await applicationService.findOne({ _id: job.applicationId });

          const from = sequence.trigger?.senderEmail;

          if (!from) {
            return await failJob(job._id, 'Sequence has no sender email set');
          }

          if (!app?.gmailCredentials?.[from]) {
            return await failJob(job._id, 'Application not found or no gmail credentials provided');
          }

          await sendEmail(
            email,
            job.applicationId,
            job.data.targetEmail,
          );

          let nextEmail = await sequenceEmailService.findNextEnabledEmail(email);
          let nextSequence = null;

          if (!nextEmail && sequence.trigger?.allowMoveToNextSequence) {
            nextSequence = await sequenceService.findNextEnabledSequence(sequence);
            if (nextSequence) {
              const { results: nextEmails } = await sequenceEmailService.find({
                sequenceId: nextSequence._id,
                enabled: true,
                deletedOn: { $exists: false },
              });
              nextEmail = nextEmails?.[0];
            }
          }

          const userUpdates = {
            'sequences.$._id': nextSequence ? nextSequence._id : sequence._id,
            'sequences.$.name': nextSequence ? nextSequence.name : sequence.name,
            'sequences.$.lastEmail': job.data.emailId,
            'sequences.$.pendingEmail': nextEmail?._id || null,
          };

          await pipelineUserService.atomic.updateOne({
            'pipelines._id': job.data.pipelineId,
            'sequences._id': sequence._id,
            deletedOn: { $exists: false },
          }, {
            $set: userUpdates,
          });

          if (nextEmail) {
            await scheduledJobService.scheduleSequenceEmail(nextEmail, job.data.targetEmail);
          }

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
