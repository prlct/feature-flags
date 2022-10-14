import Joi from 'joi';

const extendedJoi = Joi.extend({
  type: 'json',
  base: Joi.string().trim().allow(null, ''),
  coerce: {
    from: 'string',
    method(value, helpers) {
      if (value === '') {
        return { value };
      }
      try {
        return JSON.parse(value);
      } catch (error) {
        return { errors: helpers.error('json.invalid', { value }) };
      }
    },
  },
});

export default extendedJoi;
