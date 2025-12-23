import { Router } from "express";
import type { AuthService } from "../../../application/ports/AuthService.js";
import { CreateVehicle } from "../../../application/usecases/CreateVehicle.js";
import { UpdateVehicle } from "../../../application/usecases/UpdateVehicle.js";
import { ListVehiclesByStatus } from "../../../application/usecases/ListVehiclesByStatus.js";
import { ListSoldVehicles } from "../../../application/usecases/ListSoldVehicles.js";
import { PurchaseVehicle } from "../../../application/usecases/PurchaseVehicle.js";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createVehicleController,
  listAvailableVehiclesController,
  listSoldVehiclesController,
  purchaseVehicleController,
  updateVehicleController
} from "../controllers/vehicleController.js";
import type { VehicleRepository } from "../../../domain/repositories/VehicleRepository.js";
import type { SaleRepository } from "../../../domain/repositories/SaleRepository.js";
import type { PurchaseVehicleGateway } from "../../../application/ports/PurchaseVehicleGateway.js";

interface VehicleRouteDeps {
  vehicleRepository: VehicleRepository;
  saleRepository: SaleRepository;
  purchaseGateway: PurchaseVehicleGateway;
  authService: AuthService;
}

export function buildVehicleRoutes(deps: VehicleRouteDeps): Router {
  const router = Router();
  const createVehicle = new CreateVehicle(deps.vehicleRepository);
  const updateVehicle = new UpdateVehicle(deps.vehicleRepository);
  const listAvailable = new ListVehiclesByStatus(deps.vehicleRepository);
  const listSold = new ListSoldVehicles(deps.saleRepository);
  const purchaseVehicle = new PurchaseVehicle(deps.purchaseGateway);

  router.post("/", createVehicleController(createVehicle));
  router.put("/:id", updateVehicleController(updateVehicle));
  router.get("/available", listAvailableVehiclesController(listAvailable));
  router.get("/sold", listSoldVehiclesController(listSold));
  router.post("/:id/purchase", requireAuth(deps.authService), purchaseVehicleController(purchaseVehicle));

  return router;
}
