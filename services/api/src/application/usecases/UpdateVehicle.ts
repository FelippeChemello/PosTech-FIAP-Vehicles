import type { Vehicle } from "../../domain/vehicle/Vehicle.js";
import type { VehicleRepository } from "../../domain/repositories/VehicleRepository.js";
import type { UpdateVehicleDTO } from "../dtos/VehicleDTOs.js";
import { VehicleAlreadySoldError, VehicleNotFoundError } from "../errors.js";
import { VehicleStatus } from "../../domain/vehicle/VehicleStatus.js";

export class UpdateVehicle {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(id: string, data: UpdateVehicleDTO): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);

    if (!vehicle) {
      throw new VehicleNotFoundError();
    }

    if (vehicle.status === VehicleStatus.SOLD) {
      throw new VehicleAlreadySoldError();
    }

    return this.vehicleRepository.update(id, data);
  }
}
