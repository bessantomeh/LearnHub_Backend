import Joi from 'joi';

export const signup = {
  body: Joi.object().required().keys({
    username: Joi.string().min(3).max(15).required().messages({
      'any.required': 'Please provide your name',
      'string.empty': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
    password: Joi.string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Password must include upper case, lower case, and special characters',
        'any.required': 'Password is required',
      })
  }),
};
