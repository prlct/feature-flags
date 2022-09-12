import Joi from 'joi';

import { validateMiddleware, extractTokenFromHeader } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';
import { Env } from 'resources/application';
import userService from '../../user.service';
import { publicTokenAuth } from 'resources/application/middlewares';

const schema = Joi.object({
  env: Joi.string()
    .valid(...Object.values(Env))
    .required()
    .messages({
      'any.required': 'env is required',
      'string.empty': 'env is required',
    }),
  email: Joi.string().trim(),
});

type ValidatedData = {
  env: Env;
  email?: string;
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { application } = ctx.state;
  const { env, email } = ctx.validatedData;
  let user = await userService.findOne({ applicationId: application._id, env, email });

  if (user) {
    user = await userService.updateOne(
      { applicationId: application._id, env, email }, 
      () => ({ lastVisitedOn: new Date() }),
    );
  } else {
    user = await userService.insertOne({ 
      applicationId: application._id, 
      env, 
      email, 
      lastVisitedOn: new Date(), 
    });
  }

  ctx.body = user;
}

export default (router: AppRouter) => {
  router.post('/',  extractTokenFromHeader, publicTokenAuth, validateMiddleware(schema), handler);
};
