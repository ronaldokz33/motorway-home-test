import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

export const formatResponse = (object: any) => {
  if (object === null || typeof object !== 'object') {
    return object;
  }

  const result: any = {};

  Object.keys(object).forEach(key => {
    if (object[key]) {
      const snakeCaseKey = _.snakeCase(key);
      result[snakeCaseKey] = formatResponse(object[key]);
    }
  });

  return result;
};

export const tryCatch =
  (controller: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await controller(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
