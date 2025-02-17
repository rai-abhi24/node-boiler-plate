const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../../../utils');
const Schemas = require('../schemas');

const validate = (schema) => (req, _res, next) => {
    try {
        const { error } = schema.validate(req.body);
        if (error) {
            throw new AppError(error.details[0].message, StatusCodes.BAD_REQUEST);
        }
        next();
    } catch (error) {
        next(error);
    }
};

const validateParams = (schema) => (req, _res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
        throw new AppError(error.details[0].message, StatusCodes.BAD_REQUEST);
    }
    next();
};

module.exports = {
    validateCreate: validate(Schemas.demoCreateSchema),
    validateBulkCreate: validate(Schemas.demoBulkCreateSchema),
    validateUpdate: validate(Schemas.demoUpdateSchema),
    validateIdParam: validateParams(Schemas.demoIdParamSchema),
};
