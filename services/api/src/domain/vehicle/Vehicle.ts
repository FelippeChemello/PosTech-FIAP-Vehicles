import { VehicleStatus } from "./VehicleStatus.js";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  status: VehicleStatus;
  createdAt: Date;
  updatedAt: Date;
}
