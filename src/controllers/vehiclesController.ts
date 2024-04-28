import { Request, Response } from 'express';
import Vehicle from '../models/vehicle';
import logger from '../common/logs/pino';
import * as vehicleService from '../services/vehicleService';
import VehicleRequest from '../models/request/vehicleRequest';
import { formatResponse } from '../common/utils/utils';

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

  return res.status(404).json({ message: 'No vehicles found' });
};

export const Post = async (req: Request, res: Response) => {
  logger.info(req.body, 'Create Vehicle');

  const {
    body: { make, state, model },
  } = req;

  const request: VehicleRequest = new VehicleRequest(make, model, state);

  const response = await vehicleService.CreateVehicle(request);

  if (response == null || response.Id <= 0) {
    return res.status(422).json({ message: 'Unprocessable Content' });
  }

  return res
    .status(201)
    .json({ message: 'Vehicle created', body: formatResponse(response) });
};
