import Joi from 'joi';

const analyticsItemSchema = Joi.object().pattern( Joi.string(), Joi.number());

const schema = Joi.object({
  _id: Joi.string().required(),
  companyId: Joi.string().required(),
  sendingEmails: analyticsItemSchema,
  adminId: Joi.string().required(),
  expirationOn: Joi.date(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
