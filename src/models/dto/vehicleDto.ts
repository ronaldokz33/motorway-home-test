export default class VehicleDto {
  constructor(id: number, make: string, model: string, state: string) {
    this.Id = id;
    this.Make = make;
    this.Model = model;
    this.State = state;
  }

  Id: number;

  Make: string;

  Model: string;

  State: string;
}
