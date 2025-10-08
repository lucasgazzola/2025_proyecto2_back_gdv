import os from "os";
import { IHealthService } from "./interfaces/health.service.interface";

interface DbClientQueryRaw {
  $queryRaw: (query: TemplateStringsArray) => Promise<any>;
}

export class HealthService implements IHealthService {
  constructor(private dbClient: DbClientQueryRaw) {}

  async checkDatabase() {
    try {
      await this.dbClient.$queryRaw`SELECT 1`;
      return { status: "ok" };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return { status: "error", error: errorMsg };
    }
  }

  getHealth() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage().rss,
      hostname: os.hostname(),
    };
  }

  async getFullHealth() {
    const db = await this.checkDatabase();

    return {
      ...this.getHealth(),
      dependencies: {
        database: db.status,
        databaseError: db.error,
      },
    };
  }
}
