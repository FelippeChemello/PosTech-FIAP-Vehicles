import type { Sale } from "../../domain/sale/Sale.js";
import type { Vehicle } from "../../domain/vehicle/Vehicle.js";

export interface PurchaseVehicleGateway {
  purchase(vehicleId: string, buyerId: string): Promise<{ sale: Sale; vehicle: Vehicle }>;
}
