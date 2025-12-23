import type { Vehicle } from "../vehicle/Vehicle.js";
import type { VehicleStatus } from "../vehicle/VehicleStatus.js";

export interface VehicleRepository {
  create(data: Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "status"> & { status?: VehicleStatus }): Promise<Vehicle>;
  update(id: string, data: Partial<Omit<Vehicle, "id" | "createdAt" | "updatedAt">>): Promise<Vehicle>;
  findById(id: string): Promise<Vehicle | null>;
  listByStatus(status: VehicleStatus): Promise<Vehicle[]>;
}
