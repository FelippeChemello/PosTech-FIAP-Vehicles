import type { SaleRepository } from "../../domain/repositories/SaleRepository.js";
import type { SoldVehicleDTO } from "../dtos/SaleDTOs.js";

export class ListSoldVehicles {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(): Promise<SoldVehicleDTO[]> {
    return this.saleRepository.listWithVehicle();
  }
}
