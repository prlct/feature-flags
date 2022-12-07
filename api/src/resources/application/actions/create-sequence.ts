import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import sequenceService from 'resources/sequence/sequence.service';
import applicationAuth from '../middlewares/application-auth.middleware';

const schema = Joi.object({
  name: Joi.string().required(),
  trigger: Joi.object({
    name: Joi.string().required(),
    eventName: Joi.string(),
    eventKey: Joi.string(),
    allowRepeat: Joi.bool().default(false),
    repeatDelay: Joi.number().min(0).integer(),
    description: Joi.string().empty(null).default('').allow(''),
  }),
  pipelineId: Joi.string().required(),
});

type ValidatedData = {
  name: string,
  pipelineId: string,
  trigger: object,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { applicationId } = ctx.params;
  const { name, pipelineId, trigger } = ctx.validatedData;

  ctx.body = await sequenceService.insertOne({
    applicationId,
    pipelineId,
    name,
    enabled: false,
    trigger,
  });
};

export default (router: AppRouter) => {
  router.post('/:applicationId/sequences', applicationAuth, validateMiddleware(schema), handler);
};
