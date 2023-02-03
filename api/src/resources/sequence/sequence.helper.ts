import { generateId } from '@paralect/node-mongo';

import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import { Env } from 'resources/application';
import { amplitudeService } from 'services';
import scheduledJobService from 'resources/scheduled-job/scheduled-job.service';
import { Pipeline } from 'resources/pipeline';
import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import pipelineService from 'resources/pipeline/pipeline.service';

import sequenceService from './sequence.service';

const triggerEvent = async (
  eventKey: string,
  applicationId: string,
  env: Env,
  email: string,
  firstName?: string,
  lastName?: string,
) => {
  const { results: sequences } = await sequenceService.find({
    enabled: true,
    applicationId,
    env,
    $or: [
      { 'trigger.eventKey': eventKey },
      { 'trigger.stopEventKey': eventKey },
    ],
  });

  for (const sequence of sequences) {
    if (sequence.trigger?.eventKey === eventKey) {
      const pipeline = await pipelineService.findOne({ _id: sequence.pipelineId }) as Pipeline;
      const { results: [sequenceEmail] } = await sequenceEmailService.find({
        sequenceId: sequence._id,
        enabled: true,
        deletedOn: { $exists: false },
      }, { sort: { index: -1 }, limit: 1 });
      await pipelineUserService.atomic.updateOne({
        applicationId,
        email,
        deletedOn: { $exists: false },
      }, {
        $set: {
          firstName,
          lastName,
          email,
          applicationId,
        },
        $setOnInsert: { _id: generateId() },
        $addToSet: {
          pipelines: {
            _id: pipeline._id,
            name: pipeline.name,
          },
          sequences: {
            _id: sequence._id,
            name: sequence.name,
            pipelineId: pipeline._id,
            pendingEmail: sequenceEmail._id,
          },
        },
      }, { upsert: true });
      const totalDocuments = await pipelineUserService.countDocuments(
        { applicationId: pipeline.applicationId },
        { requireDeletedOn: true },
      );

      if (totalDocuments === 1) {
        amplitudeService.trackEvent(applicationId, 'First subscriber added');
      }

      await scheduledJobService.scheduleSequenceEmail(sequenceEmail, email);
      await sequenceService.atomic.updateOne({ _id: sequence._id }, { $inc: { total: 1 } });
    } else if (sequence.trigger?.stopEventKey === eventKey) {
      const { modifiedCount } = await pipelineUserService.atomic.updateOne({
        applicationId,
        email,
        deletedOn: { $exists: false },
        sequences: { $elemMatch: { _id: sequence._id, finishedOn: { $exists: false } } },
      }, {
        $set: {
          'sequences.$.finishedOn': new Date(),
        },
      }, { upsert: false });

      await sequenceService.atomic.updateOne({ _id: sequence._id }, {
        $inc: {
          completed: modifiedCount,
        },
      });
    }
  }
};

export default { triggerEvent };
