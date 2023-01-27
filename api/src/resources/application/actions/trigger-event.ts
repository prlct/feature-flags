import Joi from 'joi';

import { AppKoaContext, AppRouter } from 'types';
import { extractTokenFromHeader, validateMiddleware } from 'middlewares';
import userService from 'resources/user/user.service';

import { extractTokenFromQuery } from '../middlewares';
import publicTokenAuthMiddleware from '../middlewares/public-token-auth.middleware';
import sequenceService from 'resources/sequence/sequence.service';
import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import pipelineService from 'resources/pipeline/pipeline.service';
import scheduledJobService from 'resources/scheduled-job/scheduled-job.service';
import { generateId } from '@paralect/node-mongo';

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

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { userId, eventKey, firstName, lastName } = ctx.validatedData;

  const user = await userService.findOne({ $or: [ { _id: userId }, { 'data.id': userId }] });

  if (!user) {
    ctx.status = 400;
    ctx.body = 'fail';
    return;
  }
  const email = user.email || user.data.email;
  const application = ctx.state.application;

  const { results: [sequence] } = await sequenceService.find({
    applicationId: application._id,
    'trigger.eventKey': eventKey,
    enabled: true,
    deletedOn: { $exists: false },
  }, { sort: { index: -1 }, limit: 1 });

  if (!sequence) {
    ctx.status = 400;
    ctx.body = 'fail';
    return;
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
    ctx.status = 400;
    ctx.body = 'fail';
    return;
  }

  const pipeline = await pipelineService.findOne({ _id: sequence.pipelineId });

  if (!pipeline) {
    ctx.status = 400;
    ctx.body = 'fail';
    return;
  }

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

    await scheduledJobService.scheduleSequenceEmail(sequenceEmail, email);
  }

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
