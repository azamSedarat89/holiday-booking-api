import * as Joi from 'joi';

export const jwtValidationSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
});
