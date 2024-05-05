import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';
import logger from '../../common/logs/pino';
import AppError from './AppError';

export default function generalErrorHandler(
  error: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction,
) {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      type: 'ValidationError',
      details: error.errors,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      errorCode: error.errorCode,
      message: error.message,
    });
  }

  logger.error(`Unhandled error in generalErrorHandler`);
  logger.error(`${error.message}\n${error.name}\n${error.stack}`);

  return res.status(500).send('Something went wrong');
}
