import pg from 'pg';

import logger from '../logs/pino';

const URL =
  process.env.DB_URL || 'postgres://user:password@localhost:5432/motorway';
const pool = new pg.Pool({
  connectionString: URL,
  max: Number(process.env.DB_POOL) || 200,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 10000,
});

const connected = () => {
  logger.info(`database.js: Connected  to db ${URL}`);
};

const connect = async () => {
  try {
    logger.info(`Connecting to db ${URL}`);
    await pool.connect();
  } catch (err) {
    setTimeout(() => {
      connect();
      logger.error(
        `database.js: an error occured when connecting ${err} retrying connection on 3 secs`,
      );
    }, 3000);
  }
};

pool.on('error', connect);
pool.once('connect', connected);

pool.connect();

export default pool;
