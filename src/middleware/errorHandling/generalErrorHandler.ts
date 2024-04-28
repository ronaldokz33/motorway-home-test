import { NextFunction, Request, Response } from 'express';
import logger from '../../common/logs/pino';

export default function generalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction,
) {
  logger.error(`Unhandled error in generalErrorHandler`);
  logger.error(`${err.message}\n${err.name}\n${err.stack}`);
  return res.sendStatus(500);
}
