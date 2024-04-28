import { QueryResult } from 'pg';
import StateLogDto from '../../models/dto/stateLogDto';
import postgreeConnection from './postgree';

const GetLogsByVehicleIdAndDate = async (
  vehicleId: number,
  date: Date,
): Promise<StateLogDto[] | null> => {
  const response: QueryResult<any> = await postgreeConnection.query(
    `SELECT * FROM public."stateLogs" WHERE "vehicleId" = $1 AND "timestamp" <= $2`,
    [vehicleId, date],
  );

  if (response.rowCount === 0) {
    return null;
  }

  return response.rows.map((item: any) => {
    return new StateLogDto(item.vehicleId, item.state, item.timestamp);
  });
};

export default GetLogsByVehicleIdAndDate;
