import Joi from 'joi';

/*
  Validation for user authentication and password reset.
 */

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

export const signin = {
  body: Joi.object().required().keys({
    email: Joi.string().email().required().messages({
      'any.required': 'please send your email',
    }),
    password: Joi.string().required(),
  }),
};

export const sendCode = {
  body: Joi.object().required().keys({
    email: Joi.string().email().required().messages({
      'any.required': 'please send your email',
    }),
  }),
};

export const forgetpassword = {
  body: Joi.object().required().keys({
    code: Joi.string().required(),
    email: Joi.string().email().required(),
    newPassword: Joi.string().min(5).max(20).required(),
  }),
};

export const verifyCode = {
  body: Joi.object().required().keys({
      email: Joi.string().email().required().messages({
          'any.required': 'Email is required',
          'string.empty': 'Email cannot be empty',
          'string.email': 'Invalid email format',
      }),
      code: Joi.string().required().messages({
          'any.required': 'Verification code is required',
          'string.empty': 'Verification code cannot be empty',
      }),
  }),
};