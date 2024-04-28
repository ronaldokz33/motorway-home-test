export default class StateLogDto {
  constructor(vehicleId: number, state: string, timestamp: Date) {
    this.VehicleId = vehicleId;
    this.State = state;
    this.Timestamp = timestamp;
  }

  VehicleId: number;

  State: string;

  Timestamp: Date;
}
