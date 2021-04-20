import Joi from 'joi';

export const signupSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    phoneNumber: Joi.number().required(),
    dob: Joi.string().required(),
    username: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
});
