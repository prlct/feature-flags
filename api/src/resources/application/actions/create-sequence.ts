import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import sequenceService from 'resources/sequence/sequence.service';
import applicationAuth from '../middlewares/application-auth.middleware';

const schema = Joi.object({
  name: Joi.string().required(),
  pipelineId: Joi.string().required(),
  trigger: Joi.object({
    name: Joi.string().required(),
    key: Joi.string().required(),
    eventName: Joi.string(),
    eventKey: Joi.string(),
    allowRepeat: Joi.bool(),
    repeatDelay: Joi.number(),
  }).allow(null).default(null),
});

type ValidatedData = {
  name: string,
  pipelineId: string,
  trigger: {
    name: string,
    description: string | null,
    key: string,
  } | null
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { applicationId } = ctx.params;
  const { name, pipelineId, trigger } = ctx.validatedData;

  ctx.body = await sequenceService.insertOne({
    applicationId,
    pipelineId,
    name,
    trigger,
    enabled: false,
  });
};

export default (router: AppRouter) => {
  router.post('/:applicationId/sequences', applicationAuth, validateMiddleware(schema), handler);
};
