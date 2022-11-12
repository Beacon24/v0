const Joi = require('joi');

module.exports.groupSchema = Joi.object({
    group: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        // image: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
})

module.exports.initiativeSchema = Joi.object({
    initiative: Joi.object({
        description: Joi.string().required()
    }).required()
})

module.exports.userSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
})