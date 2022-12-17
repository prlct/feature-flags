import { AppKoaContext, AppRouter } from 'types';
import Joi from 'joi';
import { validateMiddleware } from 'middlewares';

import sequenceService from 'resources/sequence/sequence.service';
import pipelineService from 'resources/pipeline/pipeline.service';
import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import scheduledJobService from 'resources/scheduled-job/scheduled-job.service';

import applicationAuth from '../middlewares/application-auth.middleware';

const schema = Joi.object({
  sequenceId: Joi.string().required(),
  email: Joi.string().email().required(),
});

type ValidatedData = {
  sequenceId: string,
  email: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { sequenceId, email } = ctx.validatedData;
  const { applicationId } = ctx.params;

  const sequence = await sequenceService.findOne({ _id: sequenceId, applicationId, deletedOn: { $exists: false } });

  if (!sequence) {
    ctx.throw(400, 'Sequence not found');
    return;
  }

  const pipeline = await pipelineService.findOne({
    _id: sequence.pipelineId,
    applicationId,
    deletedOn: { $exists: false },
  });

  if (!pipeline) {
    ctx.throw(400, 'Pipeline not found');
    return;
  }

  const existingUser = await pipelineUserService.findOne({
    email,
    applicationId,
    'pipeline._id': pipeline._id,
    'sequence._id': sequence._id,
    finished: false,
    deletedOn: { $exists: false },
  });

  if (existingUser) {
    ctx.throw(400, 'User already in an active pipeline');
  }

  const { results } = await sequenceEmailService.find({ sequenceId, deletedOn: { $exists: false }, enabled: true });

  const createdUser = await pipelineUserService.insertOne({
    email,
    applicationId,
    pipeline: {
      _id: pipeline._id,
      name: pipeline.name,
    },
    sequence: {
      _id: sequence._id,
      name: sequence.name,
      lastEmailId: null,
      pendingEmailId: results?.[0]?._id,
    },
  });

  await scheduledJobService.scheduleSequenceEmail(results[0], email);

  ctx.body = createdUser;
};


export default (router: AppRouter) => {
  router.post('/:applicationId/pipeline-users', applicationAuth, validateMiddleware(schema), handler);
};
