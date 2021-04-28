import Joi from 'joi';

export const pinSchema = Joi.object({
    pin: Joi.number().required()
});

export const amountSchema = Joi.object({
    // amount: Joi.number().precision(3).required(),
    amount: Joi.number().precision(2).required()
})

export const transferSchema = Joi.object({
    recipientUsername: Joi.string().trim().required(),
    amount: Joi.number().precision(2).required(),
    // amount: Joi.number().precision(3).required(),
    pin: Joi.number().required(),
});
