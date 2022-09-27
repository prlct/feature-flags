import Joi from 'joi';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { Env } from 'resources/application';
import { featureService, Feature } from 'resources/feature';
import featureAuth from '../middlewares/feature-auth.middleware';
import { TargetingRule, TargetingRuleOperator } from '../feature.types';

const RULES_MAX_COUNT = 50;

const schema = Joi.object({
  env: Joi.string()
    .valid(...Object.values(Env))
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
  targetingRules: Joi.array().items( Joi.object({
    attribute: Joi.string().allow(null, ''),
    operator: Joi.string().valid(...Object.values(TargetingRuleOperator)),
    value: Joi.any()
      .when('type', {
        is: TargetingRuleOperator.EQUALS,
        then: Joi.string(),
      })
      .when('type', {
        is: TargetingRuleOperator.INCLUDES,
        then: Joi.array().items(Joi.string()),
      }),
  })).max(RULES_MAX_COUNT),
});
 

type ValidatedData = {
  env: Env,
  targetingRules: Array<TargetingRule>;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { featureId } = ctx.params;
  const { env, targetingRules } = ctx.validatedData;
  
  const updatedFeature = await featureService.updateOne(
    { _id: featureId },
    (doc) => {
      doc.envSettings[env].targetingRules = targetingRules;
      return doc;
    },
  ) as Feature;

  ctx.body = updatedFeature;
}

export default (router: AppRouter) => {
  router.put('/:featureId/targeting-rules', featureAuth, validateMiddleware(schema), handler);
};