import { Request, Response } from "express";
import { IHealthService } from "../services/interfaces/health.service.interface";

export class HealthController {
  constructor(private healthService: IHealthService) {}

  async health(_req: Request, res: Response) {
    const status = await this.healthService.getHealth();
    res.json(status);
  }

  async fullHealth(_req: Request, res: Response) {
    const metrics = await this.healthService.getFullHealth();
    res.json(metrics);
  }
}
