import Joi from 'joi';

export const createUser ={
    body:Joi.object().required().keys({
        username:Joi.string().min(3).max(15).required().messages({
            'any.required':'please send your name',
            'string.empty':'name is required'
        }),
        email:Joi.string().email().required(),
        password:Joi.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]+$/).required(),
    })
}
export const updatePassword={
    body:Joi.object().required().keys({
        oldPassword:Joi.string().min(8).required(),
        newPassword:Joi.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]+$/).required() 
    }),
}

export const getUserById={
   
    params:Joi.object().required().keys({
        id:Joi.string().required()
    })
}