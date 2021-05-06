import Joi from 'joi';

export const pinSchema = Joi.object({
    pin: Joi.number().required()
});

export const recipientUsernameSchema = Joi.object({
    recipientUsername: Joi.string().trim().required(),
});


export const amountSchema = Joi.object({
    amount: Joi.number().precision(2).required()
})

export const transferSchema = Joi.object({
    recipientUsername: Joi.string().trim().required(),
    amount: Joi.number().precision(2).required(),
    pin: Joi.number().required(),
});
