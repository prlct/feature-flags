import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import featureAuth from '../../feature/middlewares/feature-auth.middleware';
import sequenceService from '../sequence.service';

const schema = Joi.object({
  name: Joi.string().required(),
});

type ValidatedData = {
  name: string,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { applicationId, pipelineId } = ctx.params;
  const { name } = ctx.validatedData;

  const createdSequence = await sequenceService.insertOne({
    applicationId,
    pipelineId,
    name,
    enabled: false,
  });

  ctx.body = createdSequence;
};

export default (router: AppRouter) => {
  router.post('/sequences', featureAuth, validateMiddleware(schema), handler);
};
