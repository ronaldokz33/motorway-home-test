import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'express-jwt';
import logger from '../../common/logs/pino';

export default async function authErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!(err instanceof UnauthorizedError)) return next(err);

  logger.debug(`Authorization failed due to ${err.code}`);

  switch (err.code) {
    case 'credentials_required':
      return res.sendStatus(401);
    case 'credentials_bad_scheme':
      return res.status(400).json({
        errors: { header: ['authorization token with bad scheme'] },
      });
    case 'invalid_token':
      return res
        .status(401)
        .json({ errors: { header: ['authorization token is invalid'] } });
    default:
      logger.error(`Unhandled UnauthorizedError with code ${err.code}`);
      return res.sendStatus(500);
  }
}
