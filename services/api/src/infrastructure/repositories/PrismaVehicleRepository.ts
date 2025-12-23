import type { VehicleRepository } from "../../domain/repositories/VehicleRepository.js";
import type { Vehicle } from "../../domain/vehicle/Vehicle.js";
import type { VehicleStatus } from "../../domain/vehicle/VehicleStatus.js";
import prisma from "../prisma/client.js";
import type { VehicleStatus as PrismaVehicleStatus } from "../prisma/generated/index.js";

function mapVehicle(vehicle: {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: { toNumber(): number } | number;
  status: PrismaVehicleStatus;
  createdAt: Date;
  updatedAt: Date;
}): Vehicle {
  return {
    ...vehicle,
    price: typeof vehicle.price === "number" ? vehicle.price : vehicle.price.toNumber(),
    status: vehicle.status as VehicleStatus
  };
}

export class PrismaVehicleRepository implements VehicleRepository {
  async create(data: Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "status"> & { status?: VehicleStatus }): Promise<Vehicle> {
    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
        status: data.status
      }
    });

    return mapVehicle(vehicle);
  }

  async update(id: string, data: Partial<Omit<Vehicle, "id" | "createdAt" | "updatedAt">>): Promise<Vehicle> {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data
    });

    return mapVehicle(vehicle);
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });

    if (!vehicle) {
      return null;
    }

    return mapVehicle(vehicle);
  }

  async listByStatus(status: VehicleStatus): Promise<Vehicle[]> {
    const vehicles = await prisma.vehicle.findMany({
      where: { status },
      orderBy: { price: "asc" }
    });

    return vehicles.map(mapVehicle);
  }
}
