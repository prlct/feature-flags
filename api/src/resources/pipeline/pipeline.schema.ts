import Joi from 'joi';
import { Env } from '../application';

const schema = Joi.object({
  _id: Joi.string().required(),

  applicationId: Joi.string().required(),
  name: Joi.string().required(),
  env: Joi.string().valid(...Object.values(Env)),
  index: Joi.number().integer().min(0),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});


export default schema;
