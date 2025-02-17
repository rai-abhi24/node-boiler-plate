const http = require('http');
const app = require('./app');
const logger = require('./common/logger');
const { config } = require('./config');
const { closePool } = require('./config/db');

async function startServer() {
    try {
        const server = http.createServer(app);
        server.listen(config.PORT, () => {
            logger.info(`🚀 Server is running at ${config.BASE_URL}:${config.PORT}`);
        });
        setupGracefulShutdown(server);
    } catch (error) {
        logger.error('Error starting server:', error);
        process.exit(1);
    }
}

function setupGracefulShutdown(server) {
    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
        process.on(signal, async () => {
            console.log('\n');
            logger.info(`${signal} received. Shutting down gracefully.`);
            server.close(async () => {
                logger.info('HTTP server closed.');
                try {
                    await closePool();
                    process.exit(0);
                } catch (err) {
                    logger.error('Error during shutdown:', err);
                    process.exit(1);
                }
            });
        });
    });
}

async function main() {
    await startServer();
}

main();
