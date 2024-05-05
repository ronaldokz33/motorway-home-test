import pino from 'pino';
import seq from 'pino-seq';
import { Writable } from 'stream';

// eslint-disable-next-line import/no-mutable-exports
let pinoLogger: pino.Logger<never>;

const stream: Writable = seq.createStream({
  serverUrl: process.env.LOG_STREAM || 'http://localhost:5341',
});

switch (process.env.NODE_ENV) {
  case 'development':
  case 'docker':
    pinoLogger = pino(
      {
        level: process.env.PINO_LOG_LEVEL || 'debug',
      },
      stream,
    );
    break;
  default:
    pinoLogger = pino(
      {
        level: process.env.PINO_LOG_LEVEL || 'debug',
      },
      stream,
    );
    break;
}

export default pinoLogger;
