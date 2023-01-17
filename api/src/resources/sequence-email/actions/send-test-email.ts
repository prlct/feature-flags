import { AppKoaContext, AppRouter } from 'types';
import Joi from 'joi';

import sequenceEmailService from 'resources/sequence-email/sequence-email.service';
import { validateMiddleware } from 'middlewares';

import sequenceEmailAccess from '../middlewares/sequence-email-access';
import { sendEmail } from 'services/google/gmail-sender.service';

const schema = Joi.object({
  email: Joi.string().email().required(),
});

type ValidatedData = {
  email: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { sequenceEmailId } = ctx.params;
  const { email } = ctx.validatedData;
  const applicationId = ctx.state.admin.currentApplicationId;

  const sequenceEmail = await sequenceEmailService.findOne({ _id: sequenceEmailId });

  if (!sequenceEmail) {
    ctx.throwClientError({ email: 'Email not found' });
    return;
  }

  await sendEmail(sequenceEmail, applicationId, email);

  ctx.body = 'ok';
};

export default (router: AppRouter) => {
  router.post('/:sequenceEmailId/send-test-email', validateMiddleware(schema), sequenceEmailAccess, handler);
};
