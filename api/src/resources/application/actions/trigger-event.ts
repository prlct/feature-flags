import Joi from 'joi';
import { generateId } from '@paralect/node-mongo';

import { AppKoaContext, AppRouter } from 'types';
import { extractTokenFromHeader, validateMiddleware } from 'middlewares';
import userService from 'resources/user/user.service';
import sequenceService from 'resources/sequence/sequence.service';
import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import pipelineService from 'resources/pipeline/pipeline.service';
import scheduledJobService from 'resources/scheduled-job/scheduled-job.service';
import { PipelineUser } from 'resources/pipeline-user/pipeline-user.types';
import { User } from 'resources/user';
import { Sequence } from 'resources/sequence';
import { SequenceEmail } from 'resources/sequence-email';
import { Pipeline } from 'resources/pipeline';
import { Application } from 'resources/application/application.types';

import { extractTokenFromQuery } from '../middlewares';
import publicTokenAuthMiddleware from '../middlewares/public-token-auth.middleware';
import { amplitudeService } from '../../../services';

const schema = Joi.object({
  eventKey: Joi.string().required(),
  userId: Joi.string().trim().required(),
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
}).required();

type ValidatedData = {
  userId: string,
  eventKey: string,
  firstName?: string,
  lastName?: string,
};

const handleStartEvent = async (
  user: User,
  sequence: Sequence,
  pipelineUser: PipelineUser | null,
  sequenceEmail: SequenceEmail,
  pipeline: Pipeline,
  firstName: string | undefined,
  lastName: string | undefined,
  email: string,
  application: Application,
) => {
  if (!pipelineUser) {
    await pipelineUserService.atomic.updateOne({
      applicationId: application._id,
      email,
      deletedOn: { $exists: false },
    }, {
      $set: {
        firstName,
        lastName,
        email,
        applicationId: pipeline.applicationId,
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
      amplitudeService.trackEvent(application._id, 'First subscriber added');
    }

    await scheduledJobService.scheduleSequenceEmail(sequenceEmail, email);
    await sequenceService.atomic.updateOne({ _id: sequence._id }, { $inc: { total: 1 } });
  }
};

const handleStopEvent = async (
  user: User,
  sequence: Sequence,
  pipelineUser: PipelineUser | null,
  pipeline: Pipeline,
  email: string,
  application: Application,
) => {
  if (!pipelineUser) {
    return;
  }

  const { modifiedCount } = await pipelineUserService.atomic.updateOne({
    applicationId: application._id,
    email,
    deletedOn: { $exists: false },
    sequences: { $elemMatch: { _id: sequence._id, finishedOn: { $exists: false } } },
  }, {
    $set: {
      email,
      'sequences.$.finishedOn': new Date(),
    },
  }, { upsert: false });

  await sequenceService.atomic.updateOne({ _id: sequence._id }, {
    $inc: {
      completed: modifiedCount,
    },
  });
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { userId, eventKey, firstName, lastName } = ctx.validatedData;

  const user = await userService.findOne({ $or: [{ _id: userId }, { 'data.id': userId }] });

  if (!user) {
    ctx.throwClientError({ sequence: 'User not found' }, 400);
  }
  const email = user.email || user.data.email;
  const application = ctx.state.application;

  const { results: [sequence] } = await sequenceService.find({
    applicationId: application._id,
    enabled: true,
    env: user.env,
    deletedOn: { $exists: false },
    $or: [{ 'trigger.eventKey': eventKey }, { 'trigger.stopEventKey': eventKey }],
  }, { sort: { index: -1 }, limit: 1 });

  if (!sequence) {
    ctx.throwClientError({ sequence: 'Not found' }, 400);
  }

  const pipelineUser = await pipelineUserService.findOne({
    'pipelines._id': sequence.pipelineId,
    'sequences._id': sequence._id,
    email: email,
    deletedOn: { $exists: false },
  });

  const { results: [sequenceEmail] } = await sequenceEmailService.find({
    sequenceId: sequence._id,
    enabled: true,
    deletedOn: { $exists: false },
  }, { sort: { index: -1 }, limit: 1 });

  if (!sequenceEmail) {
    ctx.throwClientError({ sequenceEmail: 'Not found' }, 400);
  }

  const pipeline = await pipelineService.findOne({ _id: sequence.pipelineId });

  if (!pipeline) {
    ctx.throwClientError({ pipeline: 'Not found' }, 400);
  }

  if (sequence.trigger?.eventKey === eventKey) {
    handleStartEvent(user, sequence, pipelineUser, sequenceEmail, pipeline, firstName, lastName, email, application);
  } else if (sequence.trigger?.stopEventKey === eventKey) {
    handleStopEvent(
      user,
      sequence,
      pipelineUser,
      pipeline,
      email,
      application,
    );
  }

  amplitudeService.trackEvent(userId, 'SDK Track event');

  ctx.body = 'ok';
}

export default (router: AppRouter) => {
  router.post(
    '/trigger-event',
    extractTokenFromQuery,
    extractTokenFromHeader,
    publicTokenAuthMiddleware,
    validateMiddleware(schema),
    handler,
  );
};
