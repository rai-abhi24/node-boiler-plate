const dotenv = require('dotenv');
const { getEnvironmentDetails } = require('../utils/pathUtils.js');

const envDetails = getEnvironmentDetails();
dotenv.config({ path: envDetails.filePath });

const PORT = process.env.PORT || 8000;
const BASE_URL = process.env.BASE_URL;

const DB_CONFIG = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
    timezone: process.env.DB_TIMEZONE || 'Z',
};

module.exports = {
    PORT,
    BASE_URL,
    DB_CONFIG,
};
