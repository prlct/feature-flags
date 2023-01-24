import Joi from 'joi';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';

import sequenceService from 'resources/sequence/sequence.service';
import pipelineUserService from 'resources/pipeline-user/pipeline-user.service';
import { unsubscribeTokenService } from 'resources/unsubscribe-token';
import sequenceEmailService from 'resources/sequence-email/sequence-email.service';

const schema = Joi.object({
  token: Joi.string().required(),
});

type ValidatedData = {
  token: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { token } = ctx.validatedData;

  const tokenEntity = await unsubscribeTokenService.findOne({ value: token });

  ctx.assertError(tokenEntity, 'Invalid token');

  const user = await pipelineUserService.findOne({ _id: tokenEntity.pipelineUser });
  ctx.assertError(user, 'Subscriber not found');

  await pipelineUserService.atomic.updateOne({ _id: user._id, 'sequences._id': tokenEntity.sequenceId }, {
    $set: {
      'sequences.$.finishedOn': new Date(),
    },
  });
  await sequenceService.atomic.updateOne({ _id: tokenEntity.sequenceId }, {
    $inc: {
      dropped: 1,
    },
  });
  await sequenceEmailService.atomic.updateOne({ _id: tokenEntity.emailId }, { $inc: { dropped: 1 } });

  await unsubscribeTokenService.deleteSoft({ _id: tokenEntity._id });
};

export default (router: AppRouter) => {
  router.get('/unsubscribe/:token', validateMiddleware(schema), handler);
};
