import Vehicle from '../models/vehicle';
import VehicleDto from '../models/dto/vehicleDto';
import VehicleRequest from '../models/request/vehicleRequest';
import stateLogDto from '../models/dto/stateLogDto';
import redis from '../common/cache/redis';
import logger from '../common/logs/pino';
import * as vehicleRepository from '../common/db/vehicleRepository';
import GetLogsByVehicleIdAndDate from '../common/db/stateLogRepository';

const GetLastState = (states: stateLogDto[]): stateLogDto => {
  states.sort((a, b) => (a.Timestamp > b.Timestamp ? 1 : -1));
  return states[states.length - 1];
};

export const GetVehicleStateByDate = async (
  vehicleId: number,
  date: Date,
): Promise<Vehicle | null> => {
  const cacheResponse: string | null = await redis.get(
    `${vehicleId.toString()}&${date.toString()}`,
  );

  if (cacheResponse != null) {
    logger.info(
      `Read from cache key: ${vehicleId.toString()}&${date.toString()}`,
    );
    return JSON.parse(cacheResponse);
  }

  const dbResponse: VehicleDto | null =
    await vehicleRepository.GetById(vehicleId);
  logger.info(`Read from db: ${vehicleId.toString()}&${date.toString()}`);

  if (dbResponse == null) return null;

  const vehicleState = await GetLogsByVehicleIdAndDate(vehicleId, date);

  if (vehicleState != null) {
    const lastState: stateLogDto = GetLastState(vehicleState);
    logger.info(`Last state`, lastState);

    const response = new Vehicle(
      dbResponse.Id,
      dbResponse.Make,
      dbResponse.Model,
      lastState.State,
    );

    await redis.set(
      `${vehicleId.toString()}&${date.toString()}`,
      JSON.stringify(response),
      { EX: 60 },
    );
    return response;
  }

  const response = new Vehicle(
    dbResponse.Id,
    dbResponse.Make,
    dbResponse.Model,
    dbResponse.State,
  );

  await redis.set(
    `${vehicleId.toString()}&${date.toString()}`,
    JSON.stringify(response),
    { EX: 60 },
  );
  return response;
};

export const GetVehicle = async (
  vehicleId: number,
): Promise<Vehicle | null> => {
  const cacheResponse: string | null = await redis.get(
    `${vehicleId.toString()}`,
  );

  if (cacheResponse != null) {
    logger.info(`Read from cache key: ${vehicleId.toString()}`);
    return JSON.parse(cacheResponse);
  }

  const dbResponse: VehicleDto | null =
    await vehicleRepository.GetById(vehicleId);
  logger.info(`Read from db: ${vehicleId.toString()}`);

  if (dbResponse == null) return null;

  const response = new Vehicle(
    dbResponse.Id,
    dbResponse.Make,
    dbResponse.Model,
    dbResponse.State,
  );

  await redis.set(`${vehicleId.toString()}`, JSON.stringify(response), {
    EX: 60,
  });

  return response;
};

export const CreateVehicle = async (
  param: VehicleRequest,
): Promise<Vehicle | null> => {
  const dbResponse: VehicleDto | null = await vehicleRepository.CreateVehicle(
    new VehicleDto(0, param.Make, param.Model, param.State),
  );

  if (dbResponse == null) return null;

  return new Vehicle(
    dbResponse.Id,
    dbResponse.Make,
    dbResponse.Model,
    dbResponse.State,
  );
};
