import { NextFunction, Request, Response } from 'express';
import { object, string } from 'yup';
import logger from '../../common/logs/pino';

const vehicleSchema = object().shape({
  make: string().required(),
  state: string().required(),
  model: string().required(),
});

const isDate = (date: string): boolean => {
  try {
    return !Number.isNaN(Number(new Date(date)));
  } catch (error) {
    return false;
  }
};

export const vehicleCreateValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validationError: Array<string> = [];

  if (!req.body) {
    validationError.push("can't be empty");
    return res.status(400).json({ errors: validationError });
  }

  const { body: { make, state, model } = {} } = req;

  try {
    await vehicleSchema.validate({
      make,
      state,
      model,
    });
  } catch (error: any) {
    logger.info(error, `Invalid request`);
    return res.status(400).json({ errors: error.errors });
  }

  return next();
};

export const vehicleGetValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { params: { vehicleId } = {}, query: { timestamp } = {} } = req;

  const parsedId: number = parseInt(vehicleId, 10);

  if (Number.isNaN(parsedId) || parsedId <= 0) {
    logger.info(`Invalid paramenter vehicleId: ${vehicleId}`);
    return res.status(400).json({ message: 'Invalid paramenter vehicleId' });
  }

  if (timestamp) {
    const breaked: string[] = timestamp.toString().split(' ');
    let formatted: string;

    switch (breaked.length) {
      case 3:
      case 2:
        formatted = `${breaked[0]}T${breaked[1]}`;
        break;
      default:
        formatted = timestamp.toString();
    }

    if (!isDate(formatted)) {
      logger.info(`Invalid paramenter timestamp: ${timestamp}`);
      return res.status(400).json({ message: 'Invalid paramenter timestamp' });
    }

    req.query.timestamp = formatted;
  }

  return next();
};
