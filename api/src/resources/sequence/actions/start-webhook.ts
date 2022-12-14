import Joi from 'joi';

import sequenceService from '../sequence.service';
import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import sequenceAccess from '../middlewares/sequence-access';
import sequenceEmailService from '../../sequence-email/sequence-email.service';
import pipelineUserService from '../../pipeline-user/pipeline-user.service';
import pipelineService from '../../pipeline/pipeline.service';
import scheduledJobService from '../../scheduled-job/scheduled-job.service';

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

  const sequence = await sequenceService.findOne({ 'trigger.eventKey': eventKey, deletedOn: { $exists: false } });

  if (!sequence) {
    ctx.throw(400, 'Sequence not found');
    return;
  }

  let pipelineUser = await pipelineUserService.findOne({
    'pipeline._id': sequence.pipelineId,
    deletedOn: { $exists: false },
  });

  const { results: sequenceEmails } = await sequenceEmailService.find({
    sequenceId: sequence._id,
    enabled: true,
    deletedOn: { $exists: false },
  });

  if (sequenceEmails.length < 1) {
    ctx.throw(400, 'No enabled emails found for the sequence');
    return;
  }

  const pipeline = await pipelineService.findOne({ _id: sequence.pipelineId });

  if (!pipeline) {
    ctx.throw(400, 'Pipeline not found');
    return;
  }

  const [firstEmail] = sequenceEmails;

  if (!pipelineUser) {
    pipelineUser = await pipelineUserService.insertOne({
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
        pendingEmailId: firstEmail._id,
      },
    });

    await scheduledJobService.addEmailSend(firstEmail, email);

  }

  ctx.body = 'ok';
};

export default (router: AppRouter) => {
  router.put('/webhook/start/:eventKey', sequenceAccess, validateMiddleware(schema), handler);
};
