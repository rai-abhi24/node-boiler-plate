const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');

const logger = require('./common/logger');
const { enums } = require('./constants');
const { pathUtil } = require('./utils');
const { errorHandler } = require('./common/middlewares');

const app = express();
const isProduction = pathUtil.getEnvironmentDetails().environment === enums.ENVIRONMENTS.PRODUCTION;

app.use(helmet());
app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(
    morgan(':method :url :status - :response-time ms', {
        stream: {
            write: (message) => logger.http(message.trim()),
        },
        skip: () => isProduction,
    })
);

app.get('/', (_req, res) => {
    return res.status(200).json({ message: 'Server is up and running :)' });
});

app.use('/api', require('./routes'));

app.use((_req, _res, next) => {
    const error = new Error('Route not found');
    error.statusCode = 404;
    next(error);
});

app.use(errorHandler);

module.exports = app;
