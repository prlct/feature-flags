import Joi from 'joi';

import { InvitationType } from './invitation.types';

const schema = Joi.object({
  _id: Joi.string().required(),
  type: Joi.string().valid(...Object.values(InvitationType)).required(),
  companyId: Joi.string().required(),
  email: Joi.string().required(),
  adminId: Joi.string().required(),
  token: Joi.string().required(),
  expirationOn: Joi.date(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
