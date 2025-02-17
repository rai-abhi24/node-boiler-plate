const { StatusCodes } = require('http-status-codes');
const AppError = require('./AppError');

const validate = (schema) => (req, _res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });
    if (error) {
        throw new AppError(
            error.message,
            StatusCodes.BAD_REQUEST
        );
    }
    next();
};

module.exports = validate;
