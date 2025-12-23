import type { Sale } from "../sale/Sale.js";
import type { Vehicle } from "../vehicle/Vehicle.js";

export interface SaleRepository {
  create(data: Omit<Sale, "id" | "soldAt">): Promise<Sale>;
  listAll(): Promise<Sale[]>;
  findByVehicleId(vehicleId: string): Promise<Sale | null>;
  listWithVehicle(): Promise<Array<{ sale: Sale; vehicle: Vehicle }>>;
}
