export default class VehicleRequest {
  constructor(make: string, model: string, state: string) {
    this.Make = make;
    this.Model = model;
    this.State = state;
  }

  Make: string;

  Model: string;

  State: string;
}
