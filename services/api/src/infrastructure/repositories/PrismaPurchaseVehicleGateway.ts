import type { PurchaseVehicleGateway } from "../../application/ports/PurchaseVehicleGateway.js";
import type { Sale } from "../../domain/sale/Sale.js";
import type { Vehicle } from "../../domain/vehicle/Vehicle.js";
import { VehicleAlreadySoldError, VehicleNotFoundError } from "../../application/errors.js";
import prisma from "../prisma/client.js";
import { VehicleStatus } from "../../domain/vehicle/VehicleStatus.js";
import type { Prisma, VehicleStatus as PrismaVehicleStatus } from "../prisma/generated/index.js";

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

function mapSale(sale: {
  id: string;
  vehicleId: string;
  buyerId: string;
  price: { toNumber(): number } | number;
  soldAt: Date;
}): Sale {
  return {
    ...sale,
    price: typeof sale.price === "number" ? sale.price : sale.price.toNumber()
  };
}

export class PrismaPurchaseVehicleGateway implements PurchaseVehicleGateway {
  async purchase(vehicleId: string, buyerId: string): Promise<{ sale: Sale; vehicle: Vehicle }> {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });

      if (!vehicle) {
        throw new VehicleNotFoundError();
      }

      if (vehicle.status === VehicleStatus.SOLD) {
        throw new VehicleAlreadySoldError();
      }

      const sale = await tx.sale.create({
        data: {
          vehicleId: vehicle.id,
          buyerId,
          price: vehicle.price
        }
      });

      const updatedVehicle = await tx.vehicle.update({
        where: { id: vehicle.id },
        data: { status: VehicleStatus.SOLD }
      });

      return {
        sale: mapSale(sale),
        vehicle: mapVehicle(updatedVehicle)
      };
    });
  }
}
