import { createClient } from 'redis';
import logger from '../logs/pino';

const store = createClient({
  url: process.env.REDIS_URL || 'redis://localhost',
});

const handleError = (err: Error) => {
  logger.error(`cache.js: an error occurred ${err} retrying in sec`);
};

const handleConnect = () => {
  logger.info(`cache.js: cached is connected!`);
};

store.on('error', handleError);

store.on('connect', handleConnect);

store.connect();

export default store;
