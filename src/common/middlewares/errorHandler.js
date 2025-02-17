const logger = require('../logger');
const { pathUtil } = require('../../utils');
const { enums } = require('../../constants');

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred.';
    const stack = pathUtil.getEnvironmentDetails().environment === enums.ENVIRONMENTS.PRODUCTION ? null : err.stack;
    
    logger.error(`${message}\n${stack}\n`);
    res.status(statusCode).json({
        code: statusCode,
        success: false,
        message,
    });
}

module.exports = errorHandler;
