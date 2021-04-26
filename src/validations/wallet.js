import Joi from 'joi';

const pinSchema = Joi.object({
    pin: Joi.number().required()
});

export default pinSchema;