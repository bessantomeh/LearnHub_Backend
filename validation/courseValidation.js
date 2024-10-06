import Joi from 'joi';


export const enroll = {
  body: Joi.object().required().keys({
    courseId: Joi.string().required().messages({
      'any.required': 'Please provide your course ID.',
    }),
  }),
};
