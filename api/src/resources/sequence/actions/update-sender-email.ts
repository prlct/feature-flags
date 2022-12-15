import Joi from 'joi';

import sequenceService from '../sequence.service';
import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';

import sequenceAccess from '../middlewares/sequence-access';
import { applicationService } from 'resources/application';

const schema = Joi.object({
  email: Joi.string().email().required(),
});


type ValidatedData = {
  email: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { sequenceId } = ctx.params;
  const { email } = ctx.validatedData;

  const applicationId = ctx.state.admin.applicationIds[0];

  const application = await applicationService.findOne({ _id: applicationId }, { projection: {
    'gmailCredentials': 1,
  } });

  if (!application?.gmailCredentials?.[email]) {
    ctx.throw(400, 'Invalid email');
    return;
  }

  ctx.body = await sequenceService.atomic.updateOne({ _id: sequenceId }, {
    $set: { 'trigger.senderEmail': email },
  });
};

export default (router: AppRouter) => {
  router.put('/:sequenceId/sender-email', sequenceAccess, validateMiddleware(schema), handler);
};
