import { AppKoaContext, AppRouter } from 'types';
import Joi from 'joi';
import sequenceService from 'resources/sequence/sequence.service';
import { validateMiddleware } from 'middlewares';

import applicationAuth from '../middlewares/application-auth.middleware';
import pipelineService from '../../pipeline/pipeline.service';
import pipelineUserService from '../../pipeline-user/pipeline-user.service';
import sequenceEmailService from '../../sequence-email/sequence-email.service';
import scheduledJobService from '../../scheduled-job/scheduled-job.service';

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

  const existingUser = await pipelineUserService.findOne({ email, applicationId, deletedOn: { $exists: false } });

  if (existingUser) {
    ctx.throw(400, 'User already in an active pipeline');
  }

  const { results: [firstEmail] } = await sequenceEmailService.find({ sequenceId, deletedOn: { $exists: false } });

  await scheduledJobService.addEmailSend(firstEmail, email);

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
    },
  });

  ctx.body = createdUser;
};


export default (router: AppRouter) => {
  router.post('/:applicationId/pipeline-users', applicationAuth, validateMiddleware(schema), handler);
};
