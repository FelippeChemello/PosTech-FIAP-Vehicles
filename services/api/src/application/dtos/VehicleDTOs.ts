export interface CreateVehicleDTO {
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
}

export type UpdateVehicleDTO = Partial<CreateVehicleDTO>;
