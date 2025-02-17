const fs = require('fs');
const path = require('path');
const logger = require('../common/logger');

function getRootPath() {
    return path.join(__dirname, '../../');
}

function getEnvironmentDetails() {
    const env = process.env.NODE_ENV;
    const envFileName = `.env.${env}`;
    const envFilePath = getRootPath() + envFileName;

    if (fs.existsSync(envFilePath)) {
        return { environment: env, filePath: envFilePath };
    } else {
        console.log('\n');
        logger.error(`Environment file ${envFileName} not found`);
        logger.error(`Falling back to default .env file\n`);
        return { environment: env, filePath: '' };
    }
}

function notNull(val) {
    return (
        val !== null &&
        val !== undefined &&
        val !== 'NULL' &&
        val !== 'null' &&
        val !== 'undefined' &&
        val !== 'UNDEFINED' &&
        (val + '').trim() !== ''
    );
}

module.exports = {
    getRootPath,
    getEnvironmentDetails,
    notNull,
};
