import { Request, Response } from 'express';
import Vehicle from '../models/vehicle';
import logger from '../common/logs/pino';
import * as vehicleService from '../services/vehicleService';
import VehicleRequest from '../models/request/vehicleRequest';
import { formatResponse } from '../common/utils/utils';
import AppError from '../middleware/errorHandling/AppError';

export const Get = async (req: Request, res: Response) => {
  const { params: { vehicleId } = {}, query: { timestamp } = {} } = req;

  logger.info(
    {
      id: vehicleId,
      timestamp,
    },
    `Get Vehicles: ${vehicleId}`,
  );

  const vehicleReponse: Vehicle | null = timestamp
    ? await vehicleService.GetVehicleStateByDate(
        parseInt(vehicleId, 10),
        new Date(timestamp.toString()),
      )
    : await vehicleService.GetVehicle(parseInt(vehicleId, 10));

  if (vehicleReponse) {
    return res.status(200).json({ body: formatResponse(vehicleReponse) });
  }

  throw new AppError('not_found', 'No vehicles found', 404);
};

export const Post = async (req: Request, res: Response) => {
  logger.info(req.body, 'Create Vehicle');

  const {
    body: { make, state, model },
  } = req;

  const request: VehicleRequest = new VehicleRequest(make, model, state);

  const response = await vehicleService.CreateVehicle(request);

  if (response == null || response.Id <= 0) {
    throw new AppError('entity_not_processed', 'Unprocessable Content', 422);
  }

  return res
    .status(201)
    .json({ message: 'Vehicle created', body: formatResponse(response) });
};
