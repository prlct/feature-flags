import Joi from 'joi';

import sequenceService from 'resources/sequence/sequence.service';
import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';

import sequenceAccess from '../middlewares/sequence-access';
import { applicationService } from '../../application';

const schema = Joi.object({
  name: Joi.string().required(),
  senderEmail: Joi.string().email().required(),
  eventName: Joi.string().optional(),
  eventKey: Joi.string().optional(),
  stopEventKey: Joi.string().optional(),
  allowRepeat: Joi.bool().default(false),
  allowMoveToNextSequence: Joi.bool().empty(null).default(false),
  repeatDelay: Joi.number().integer().min(0),
  description: Joi.string()
    .allow('')
    .default('')
    .optional(),
});


type ValidatedData = {
  name: string,
  eventKey?: string,
  eventName?: string,
  stopEventKey?: string,
  allowRepeat: boolean,
  repeatDelay: number,
  description: string,
  allowMoveToNextSequence: boolean,
  senderEmail: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { sequenceId } = ctx.params;
  const trigger = ctx.validatedData;

  const applicationId = ctx.state.admin.currentApplicationId;

  const application = await applicationService.findOne({ _id: applicationId }, { projection: {
    'gmailCredentials': 1,
  } });

  if (!application?.gmailCredentials?.[trigger.senderEmail]) {
    ctx.throwClientError({ email: 'Invalid email' });
    return;
  }

  ctx.body = await sequenceService.updateOne({ _id: sequenceId }, (seq) => {
    return { ...seq, trigger: { ...seq.trigger, ...trigger } };
  });
};

export default (router: AppRouter) => {
  router.put('/:sequenceId/trigger', sequenceAccess, validateMiddleware(schema), handler);
};
