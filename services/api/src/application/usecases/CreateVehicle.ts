import type { Vehicle } from "../../domain/vehicle/Vehicle.js";
import type { VehicleRepository } from "../../domain/repositories/VehicleRepository.js";
import type { CreateVehicleDTO } from "../dtos/VehicleDTOs.js";

export class CreateVehicle {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(data: CreateVehicleDTO): Promise<Vehicle> {
    return this.vehicleRepository.create(data);
  }
}
