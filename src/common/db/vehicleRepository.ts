import { QueryResult } from 'pg';
import VehicleDto from '../../models/dto/vehicleDto';
import postgreeConnection from './postgree';

export const GetById = async (
  vehicleId: number,
): Promise<VehicleDto | null> => {
  const response: QueryResult<any> = await postgreeConnection.query(
    `SELECT * FROM Vehicles WHERE Id = $1`,
    [vehicleId],
  );

  if (response.rowCount === 0) {
    return null;
  }

  return new VehicleDto(
    response.rows[0].id,
    response.rows[0].make,
    response.rows[0].model,
    response.rows[0].state,
  );
};

export const CreateVehicle = async (
  vehicle: VehicleDto,
): Promise<VehicleDto | null> => {
  const response: QueryResult<any> = await postgreeConnection.query(
    `INSERT INTO Vehicles (make, model, state) VALUES ($1, $2, $3) RETURNING id;`,
    [vehicle.Make, vehicle.Model, vehicle.State],
  );

  if (response.rowCount === 0) {
    return null;
  }

  return new VehicleDto(
    response.rows[0].id,
    vehicle.Make,
    vehicle.Model,
    vehicle.State,
  );
};
