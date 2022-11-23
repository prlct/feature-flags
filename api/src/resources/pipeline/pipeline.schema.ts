import Joi from 'joi';

const schema = Joi.object({
  id: Joi.string().required(),
  applicationId: Joi.string().required(),
  name: Joi.string().required(),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});


export default schema;
