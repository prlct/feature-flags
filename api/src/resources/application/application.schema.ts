import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),

  companyId: Joi.string().required(),
  publicApiKey: Joi.string().required(),
  privateApiKey: Joi.string().required(),
  featureIds: Joi.array().items(Joi.string()).unique().required().default([]),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
