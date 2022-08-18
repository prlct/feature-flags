import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),

  issuer: Joi.string().required(),
  firstName: Joi.string().allow(null),
  lastName: Joi.string().allow(null),
  fullName: Joi.string().allow(null),
  email: Joi.string().email().required(),
  isEmailVerified: Joi.boolean().required().default(false),
  avatarUrl: Joi.string().allow(null),

  passwordHash: Joi.string().allow(null),
  signupToken: Joi.string().allow(null),
  resetPasswordToken: Joi.string().allow(null),

  lastRequestOn: Joi.date(),
  lastLoginOn: Joi.date(),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
