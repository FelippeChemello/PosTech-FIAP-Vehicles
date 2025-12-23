import type { SaleRepository } from "../../domain/repositories/SaleRepository.js";
import type { Sale } from "../../domain/sale/Sale.js";
import type { Vehicle } from "../../domain/vehicle/Vehicle.js";
import prisma from "../prisma/client.js";

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

function mapVehicle(vehicle: {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: { toNumber(): number } | number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}): Vehicle {
  return {
    ...vehicle,
    price: typeof vehicle.price === "number" ? vehicle.price : vehicle.price.toNumber()
  } as Vehicle;
}

export class PrismaSaleRepository implements SaleRepository {
  async create(data: Omit<Sale, "id" | "soldAt">): Promise<Sale> {
    const sale = await prisma.sale.create({
      data
    });

    return mapSale(sale);
  }

  async listAll(): Promise<Sale[]> {
    const sales = await prisma.sale.findMany({ orderBy: { price: "asc" } });

    return sales.map(mapSale);
  }

  async findByVehicleId(vehicleId: string): Promise<Sale | null> {
    const sale = await prisma.sale.findUnique({ where: { vehicleId } });

    if (!sale) {
      return null;
    }

    return mapSale(sale);
  }

  async listWithVehicle(): Promise<Array<{ sale: Sale; vehicle: Vehicle }>> {
    const sales = await prisma.sale.findMany({
      orderBy: { price: "asc" },
      include: { vehicle: true }
    });

    return sales.map((item) => ({
      sale: mapSale(item),
      vehicle: mapVehicle(item.vehicle)
    }));
  }
}
