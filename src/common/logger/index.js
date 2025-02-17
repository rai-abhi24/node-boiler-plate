const winston = require('winston');

winston.addColors({
    info: 'cyan',
    error: 'red',
    warn: 'yellow',
    debug: 'green',
    http: 'magenta',
});

const level = 'debug';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'HH:mm:ss A' }),
    winston.format.printf((info) => `[${info.timestamp}] - ${info.level}: ${info.message}`)
);

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'DD-MMM-YYYY HH:mm:ss A' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
);

const transports = [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', format: fileFormat }),
];

const logger = winston.createLogger({
    level,
    levels,
    transports,
});

module.exports = logger;
