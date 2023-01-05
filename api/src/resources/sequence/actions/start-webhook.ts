import Joi from 'joi';

import sequenceService from '../sequence.service';
import { AppKoaContext, AppRouter } from 'types';
import { extractTokenFromHeader, validateMiddleware } from 'middlewares';

import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import pipelineService from 'resources/pipeline/pipeline.service';
import scheduledJobService from 'resources/scheduled-job/scheduled-job.service';
import { extractTokenFromQuery } from 'resources/application';
import privateTokenAuthMiddleware from 'resources/application/middlewares/private-token-auth.middleware';

const schema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().allow(null),
  lastName: Joi.string().allow(null),
  eventKey: Joi.string().required(),
});

type ValidatedData = {
  eventKey: string,
  email: string,
  firstName: string,
  lastName: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { eventKey } = ctx.params;
  const { email, firstName, lastName } = ctx.validatedData;
  const { _id: applicationId } = ctx.state.application;

  const sequence = await sequenceService.findOne({
    applicationId,
    'trigger.eventKey': eventKey,
    deletedOn: { $exists: false },
  });

  if (!sequence) {
    ctx.throwClientError({ sequence: 'Sequence not found' });
    return;
  }

  const pipelineUser = await pipelineUserService.findOne({
    'pipelines._id': sequence.pipelineId,
    email,
    deletedOn: { $exists: false },
  });

  const { results: sequenceEmails } = await sequenceEmailService.find({
    sequenceId: sequence._id,
    enabled: true,
    deletedOn: { $exists: false },
  });

  if (sequenceEmails.length < 1) {
    ctx.throwClientError({ sequence: 'No enabled emails found for the sequence' });
    return;
  }

  const pipeline = await pipelineService.findOne({ _id: sequence.pipelineId, deletedOn: { $exists: false } });

  if (!pipeline) {
    ctx.throwClientError({ pipeline: 'Pipeline not found' });
    return;
  }

  const [firstEmail] = sequenceEmails;

  if (!pipelineUser) {
    await pipelineUserService.insertOne({
      firstName,
      lastName,
      email,
      applicationId: pipeline.applicationId,
      pipelines: [{
        _id: pipeline._id,
        name: pipeline.name,
      }],
      sequences: [{
        _id: sequence._id,
        name: sequence.name,
        pipelineId: pipeline._id,
        pendingEmail: firstEmail._id,
      }],
    });

    await scheduledJobService.scheduleSequenceEmail(firstEmail, email);

  }

  ctx.body = 'ok';
};

export default (router: AppRouter) => {
  router.post(
    '/webhook/start/:eventKey',
    extractTokenFromHeader,
    extractTokenFromQuery,
    privateTokenAuthMiddleware,
    validateMiddleware(schema),
    handler,
  );
};
