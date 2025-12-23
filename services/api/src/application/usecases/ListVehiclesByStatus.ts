import type { Vehicle } from "../../domain/vehicle/Vehicle.js";
import type { VehicleRepository } from "../../domain/repositories/VehicleRepository.js";
import { VehicleStatus } from "../../domain/vehicle/VehicleStatus.js";

export class ListVehiclesByStatus {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(status: VehicleStatus): Promise<Vehicle[]> {
    return this.vehicleRepository.listByStatus(status);
  }
}
