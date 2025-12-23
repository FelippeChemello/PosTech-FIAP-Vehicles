import type { PurchaseVehicleGateway } from "../ports/PurchaseVehicleGateway.js";
import type { Sale } from "../../domain/sale/Sale.js";
import type { Vehicle } from "../../domain/vehicle/Vehicle.js";

export class PurchaseVehicle {
  constructor(private readonly purchaseGateway: PurchaseVehicleGateway) {}

  async execute(vehicleId: string, buyerId: string): Promise<{ sale: Sale; vehicle: Vehicle }> {
    return this.purchaseGateway.purchase(vehicleId, buyerId);
  }
}
