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
  id: Joi.string().trim(),
  data: Joi.object(),
});

type ValidatedData = {
  env: Env;
  email?: string;
  id?: string;
  data: { [key: string]: any }
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { application } = ctx.state;
  const { env, email, id, data } = ctx.validatedData;
  const externalId = id || email;
  let user = await userService.findOne({ applicationId: application._id, env, externalId });
  
  if (user) {
    user = await userService.updateOne(
      { applicationId: application._id, env, externalId }, 
      () => ({ 
        data: { email, id, ...data },
        lastVisitedOn: new Date(), 
      }),
    );
  } else {
    user = await userService.insertOne({ 
      applicationId: application._id, 
      env, 
      externalId: externalId, 
      email,
      data: { email, id, ...data },
      lastVisitedOn: new Date(), 
    });
  }

  ctx.body = user;
}

export default (router: AppRouter) => {
  router.post('/',  extractTokenFromHeader, publicTokenAuth, validateMiddleware(schema), handler);
};
