import Joi from 'joi';

const schema = Joi.object({
  _id: Joi.string().required(),

  issuer: Joi.string().allow(null),
  firstName: Joi.string().allow(null),
  lastName: Joi.string().allow(null),
  email: Joi.string().email().required(),
  isEmailVerified: Joi.boolean().required().default(false),
  avatarUrl: Joi.string().allow(null),
  ownCompanyId: Joi.string().allow(null),
  companyIds: Joi.array().items(Joi.string()).max(99).unique(),
  applicationIds: Joi.array().items(Joi.string()).max(99).unique(),
  stripeId: Joi.string().allow(null),

  oauth: Joi.object().keys({
    google: Joi.boolean().default(false),
    github: Joi.boolean().default(false),
  }),

  currentCompany: Joi.object({
    _id: Joi.string().trim().required(),
    name: Joi.string().trim().required(),
  }).required(),

  companies: Joi.array().items(Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
  })),

  currentApplicationId: Joi.string().required(),

  permissions: Joi.object({}).pattern(Joi.string().trim(), {
    manageSenderEmails: Joi.boolean(),
    manageMembers: Joi.boolean(),
    managePayments: Joi.boolean(),
  }).required(),

  lastRequestOn: Joi.date(),
  lastLoginOn: Joi.date(),

  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date(),
});

export default schema;
