import { z } from "zod";
import type { Request, Response } from "express";
import { CreateVehicle } from "../../../application/usecases/CreateVehicle.js";
import { UpdateVehicle } from "../../../application/usecases/UpdateVehicle.js";
import { ListVehiclesByStatus } from "../../../application/usecases/ListVehiclesByStatus.js";
import { ListSoldVehicles } from "../../../application/usecases/ListSoldVehicles.js";
import { PurchaseVehicle } from "../../../application/usecases/PurchaseVehicle.js";
import { VehicleAlreadySoldError, VehicleNotFoundError } from "../../../application/errors.js";
import { VehicleStatus } from "../../../domain/vehicle/VehicleStatus.js";

const vehicleSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1886),
  color: z.string().min(1),
  price: z.number().positive()
});

const vehicleUpdateSchema = vehicleSchema.partial();

export function createVehicleController(useCase: CreateVehicle) {
  return async (req: Request, res: Response) => {
    const parsed = vehicleSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });
    }

    const vehicle = await useCase.execute(parsed.data);
    return res.status(201).json(vehicle);
  };
}

export function updateVehicleController(useCase: UpdateVehicle) {
  return async (req: Request, res: Response) => {
    const parsed = vehicleUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });
    }

    try {
      const updated = await useCase.execute(req.params.id, parsed.data);
      return res.json(updated);
    } catch (error) {
      if (error instanceof VehicleNotFoundError) {
        return res.status(404).json({ error: error.message });
      }

      if (error instanceof VehicleAlreadySoldError) {
        return res.status(409).json({ error: error.message });
      }

      return res.status(500).json({ error: "update_failed" });
    }
  };
}

export function listAvailableVehiclesController(useCase: ListVehiclesByStatus) {
  return async (_req: Request, res: Response) => {
    const vehicles = await useCase.execute(VehicleStatus.AVAILABLE);
    return res.json(vehicles);
  };
}

export function listSoldVehiclesController(useCase: ListSoldVehicles) {
  return async (_req: Request, res: Response) => {
    const sales = await useCase.execute();
    return res.json(
      sales.map((item) => ({
        saleId: item.sale.id,
        price: item.sale.price,
        soldAt: item.sale.soldAt,
        buyerId: item.sale.buyerId,
        vehicle: item.vehicle
      }))
    );
  };
}

export function purchaseVehicleController(useCase: PurchaseVehicle) {
  return async (req: Request, res: Response) => {
    const buyerId = req.userId;

    if (!buyerId) {
      return res.status(401).json({ error: "missing_token" });
    }

    try {
      const result = await useCase.execute(req.params.id, buyerId);
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof VehicleNotFoundError) {
        return res.status(404).json({ error: error.message });
      }

      if (error instanceof VehicleAlreadySoldError) {
        return res.status(409).json({ error: error.message });
      }

      return res.status(500).json({ error: "purchase_failed" });
    }
  };
}
