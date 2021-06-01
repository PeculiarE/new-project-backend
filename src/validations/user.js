import Joi from 'joi';

export const usernameSchema = Joi.object({
    username: Joi.string().min(7).trim().required(),
});

export const signupSchema = Joi.object({
    firstName: Joi.string().min(2).trim().required(),
    lastName: Joi.string().min(2).trim().required(),
    email: Joi.string().trim().email().required(),
    phoneNumber: Joi.string().trim().regex(/^[0-9]{11}$/).required(),
    dob: Joi.string().required(),
    username: Joi.string().min(7).trim().required(),
    password: Joi.string().min(7).trim().required(),
});

export const emailSchema = Joi.object({
    email: Joi.string().trim().email().required()
});

export const otpSchema = Joi.object({
    otp: Joi.number().required()
});

export const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(7).trim().required()
});

export const passwordSchema = Joi.object({
    password: Joi.string().min(7).trim().required()
});
