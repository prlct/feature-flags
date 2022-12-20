import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import sequenceService from 'resources/sequence/sequence.service';
import applicationAuth from '../middlewares/application-auth.middleware';

const schema = Joi.object({
  name: Joi.string().required(),
  trigger: Joi.object({
    name: Joi.string().required(),
    eventName: Joi.string().optional(),
    eventKey: Joi.string().optional(),
    stopEventKey: Joi.string().optional(),
    allowRepeat: Joi.bool().default(false),
    repeatDelay: Joi.number().min(0).integer(),
    description: Joi.string().empty(null).default('').allow(''),
    allowMoveToNextSequence: Joi.bool().default(false),
  }).allow(null),
  pipelineId: Joi.string().required(),
});

type ValidatedData = {
  name: string,
  pipelineId: string,
  trigger?: {
    name: string,
    eventName: string,
    eventKey: string,
    stopEventKey: string,
    allowRepeat: boolean,
    repeatDelay: number,
    description: string,
    allowMoveToNextSequence: boolean,
  } | null,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { applicationId } = ctx.params;
  const { name, pipelineId, trigger } = ctx.validatedData;

  const { results } = await sequenceService.find({
    pipelineId,
    deletedOn: { $exists: false },
  }, { projection: { index: 1 }, sort: { index: -1 }, limit: 1 });

  const index = (results[0]?.index ?? -1) + 1;

  ctx.body = await sequenceService.insertOne({
    applicationId,
    pipelineId,
    name,
    enabled: false,
    trigger,
    index,
  });
};

export default (router: AppRouter) => {
  router.post('/:applicationId/sequences', applicationAuth, validateMiddleware(schema), handler);
};
