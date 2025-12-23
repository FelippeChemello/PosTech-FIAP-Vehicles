export class VehicleNotFoundError extends Error {
  constructor() {
    super("vehicle_not_found");
  }
}

export class VehicleAlreadySoldError extends Error {
  constructor() {
    super("vehicle_already_sold");
  }
}
