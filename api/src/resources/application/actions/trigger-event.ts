import Joi from 'joi';

import { AppKoaContext, AppRouter } from 'types';
import { extractTokenFromHeader, validateMiddleware } from 'middlewares';
import userService from 'resources/user/user.service';

import { extractTokenFromQuery } from '../middlewares';
import publicTokenAuthMiddleware from '../middlewares/public-token-auth.middleware';
import sequenceService from '../../sequence/sequence.service';
import pipelineUserService from '../../pipeline-user/pipeline-user.service';
import sequenceEmailService from '../../sequence-email/sequence-email.service';
import pipelineService from '../../pipeline/pipeline.service';
import scheduledJobService from '../../scheduled-job/scheduled-job.service';

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

  const user = await userService.findOne({ _id: userId });
  if (!user) {
    return;
  }
  const email = user.email || user.data.email;
  const application = ctx.state.application;

  const sequence = await sequenceService.findOne({
    applicationId: application._id,
    'trigger.eventKey': eventKey,
    enabled: true,
    index: 0,
    deletedOn: { $exists: false },
  });

  if (!sequence) {
    return;
  }

  const pipelineUser = await pipelineUserService.findOne({
    'pipeline._id': sequence.pipelineId,
    email: email,
    finished: { $ne: true },
    deletedOn: { $exists: false },
  });

  const sequenceEmail = await sequenceEmailService.findOne({
    sequenceId: sequence._id,
    enabled: true,
    index: 0,
    deletedOn: { $exists: false },
  });

  if (!sequenceEmail) {
    return;
  }

  const pipeline = await pipelineService.findOne({ _id: sequence.pipelineId, deletedOn: { $exists: false } });

  if (!pipeline) {
    return;
  }

  if (!pipelineUser) {
    await pipelineUserService.insertOne({
      firstName,
      lastName,
      email,
      applicationId: pipeline.applicationId,
      pipeline: {
        _id: pipeline._id,
        name: pipeline.name,
      },
      sequence: {
        _id: sequence._id,
        name: sequence.name,
        lastEmailId: null,
        pendingEmailId: sequenceEmail._id,
      },
    });

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
