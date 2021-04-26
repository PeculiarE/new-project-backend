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

export const sendOtpSchema = Joi.object({
    email: Joi.string().trim().email().required()
});

export const confirmOtpSchema = Joi.object({
    otp: Joi.number().required()
});

export const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required()
});

export const resetPasswordSchema = Joi.object({
    password: Joi.string().trim().required()
});