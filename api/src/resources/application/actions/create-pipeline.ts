import Joi from 'joi';
import config from 'config';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import pipelineService from 'resources/pipeline/pipeline.service';
import { Env } from '../index';
import applicationAuth from '../middlewares/application-auth.middleware';
import sequenceService from '../../sequence/sequence.service';
import { subscriptionService } from 'resources/subscription';
import { companyService } from 'resources/company';

const schema = Joi.object({
  name: Joi.string().required(),
  env: Joi.string().valid(...Object.values(Env)),
});

type ValidatedData = {
  name: string,
  env: Env,
};

const handler = async (ctx: AppKoaContext<ValidatedData>) => {
  const { name, env } = ctx.validatedData;
  const { applicationId } = ctx.params;
  const { results: pipelines } = await pipelineService.find({
    applicationId,
    deletedOn: { $exists: false },
  }, { projection: { index: 1 }, sort: { index: -1 }, limit: 1 });

  let monthlyPipelinesLimit = config.MONTHLY_PIPELINES_LIMIT;

  const company = await companyService.findOne({ adminIds: ctx.state.admin._id });

  const subscription = company?.stripeId && await subscriptionService.findOne({ customer: company.stripeId });

  if (subscription) {
    monthlyPipelinesLimit = subscription.subscriptionLimits.pipelines || 0;  
  }  

  if (company && monthlyPipelinesLimit) {
    const { results: pipelineList } = await pipelineService.find({ applicationId: ctx.state.admin.applicationIds[0] });
    const isPipelinesLength = pipelineList.length >= monthlyPipelinesLimit;

    ctx.assertClientError(!isPipelinesLength, {
      global: 'Pipelines limit exceeded',
    }); 
  }

  const index = (pipelines[0]?.index ?? -1) + 1;

  const createdPipeline = await pipelineService.insertOne({
    applicationId,
    name,
    env,
    index,
  });

  await sequenceService.insertMany([{
    pipelineId: createdPipeline._id,
    applicationId,
    enabled: false,
    name: 'New sequence',
    index: 0,
  },
  {
    pipelineId: createdPipeline._id,
    applicationId,
    enabled: false,
    name: 'New sequence',
    index: 1,
  }]);

  ctx.body = createdPipeline;
};

export default (router: AppRouter) => {
  router.post('/:applicationId/pipelines', applicationAuth, validateMiddleware(schema), handler);
};
