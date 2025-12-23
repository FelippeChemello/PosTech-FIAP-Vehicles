import type { Sale } from "../../domain/sale/Sale.js";
import type { Vehicle } from "../../domain/vehicle/Vehicle.js";

export interface SoldVehicleDTO {
  sale: Sale;
  vehicle: Vehicle;
}
