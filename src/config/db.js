const mysql = require('mysql2');
const config = require('./config');
const logger = require('../common/logger');

let pool;

try {
    pool = mysql.createPool(config.DB_CONFIG);

    pool.on('error', (err) => {
        logger.error(`Database error: ${err.code}`, { stack: err.stack });
    });

    (async () => {
        const promisePool = pool.promise();
        await promisePool.query('SELECT 1');
        logger.info('☘️  Database connected successfully.');
    })();
} catch (error) {
    logger.error('Error initializing database pool: ', error);
    throw error;
}

const promisePool = pool.promise();

function closePool() {
    return new Promise((resolve, reject) => {
        if (!pool) {
            logger.warn('Database pool is not initialized.');
            return resolve();
        }

        pool.end((err) => {
            if (err) {
                logger.error('Error closing the database pool:', err);
                return reject(err);
            }
            logger.info('Database pool closed gracefully.');
            resolve();
        });
    });
}

module.exports = { pool: promisePool, closePool };
