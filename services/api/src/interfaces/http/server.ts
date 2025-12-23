import express from "express";
import dotenv from "dotenv";
import { buildVehicleRoutes } from "./routes/vehicles.js";
import { PrismaVehicleRepository } from "../../infrastructure/repositories/PrismaVehicleRepository.js";
import { PrismaSaleRepository } from "../../infrastructure/repositories/PrismaSaleRepository.js";
import { PrismaPurchaseVehicleGateway } from "../../infrastructure/repositories/PrismaPurchaseVehicleGateway.js";
import { RemoteAuthService } from "../../infrastructure/auth/RemoteAuthService.js";

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT ?? 3000);
const authServiceUrl = process.env.AUTH_SERVICE_URL ?? "";

if (!authServiceUrl) {
  throw new Error("AUTH_SERVICE_URL is required");
}

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const vehicleRepository = new PrismaVehicleRepository();
const saleRepository = new PrismaSaleRepository();
const purchaseGateway = new PrismaPurchaseVehicleGateway();
const authService = new RemoteAuthService(authServiceUrl);

app.use(
  "/vehicles",
  buildVehicleRoutes({
    vehicleRepository,
    saleRepository,
    purchaseGateway,
    authService
  })
);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Vehicle API running on http://localhost:${port}`);
});
