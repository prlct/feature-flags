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

  ctx.body = await sequenceService.insertOne({
    applicationId,
    pipelineId,
    name,
    enabled: false,
  });
};

export default (router: AppRouter) => {
  router.post('/', featureAuth, validateMiddleware(schema), handler);
};
