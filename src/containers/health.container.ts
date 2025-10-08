import { HealthController } from "../controllers/health.controller";
import { HealthService } from "../services/health.service";
import { prismaClient } from "../config/prisma";

export const healthController = new HealthController(
  new HealthService(prismaClient)
);
