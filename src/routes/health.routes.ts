import { Router } from "express";

import { healthController } from "@/containers/health.container";

const router = Router();

router.get("/full", healthController.fullHealth.bind(healthController));
router.get("/", healthController.health.bind(healthController));

export default router;
