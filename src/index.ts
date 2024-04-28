import express from 'express';
import bodyParser from 'body-parser';
import cluster from 'cluster';
import logger from './common/logs/pino';
import vehicleRouter from './routes/api/vehicle';
import authRouter from './routes/api/auth';
import generalErrorHandler from './middleware/errorHandling/generalErrorHandler';
import authErrorHandler from './middleware/errorHandling/authErrorHandler';

const app: express.Application = express();

app.use(bodyParser.json({ limit: '5mb' }));

app.use('/api/vehicle', vehicleRouter);
app.use('/api/auth', authRouter);

app.use(authErrorHandler, generalErrorHandler);

const numForks = Number(process.env.CLUSTER_WORKERS) || 1;

if (cluster.isPrimary && process.env.CLUSTER === 'true') {
  logger.info(`Starting: Primary ${process.pid} is running`);

  for (let i = 0; i < numForks; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.info(
      `Exiting: worker ${worker.process.pid} died: code ${code} signal ${signal}`,
    );
  });
} else {
  const TIMEOUT = Number(process.env.REQ_TIMEOUT) || 5000;

  const serverApp = app.listen(process.env.NODE_PORT || 8080, () => {
    logger.info(
      `Starting:${process.pid}:Listening on ${process.env.NODE_PORT || 8080}`,
    );
  });

  if (process.env.USE_TIMEOUT === 'true') {
    serverApp.setTimeout(TIMEOUT);

    serverApp.on('timeout', (socket: any) => {
      logger.warn(`Time out connection`);
      socket.end();
    });
  }
}
