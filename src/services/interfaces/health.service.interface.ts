export interface IHealthService {
  getHealth(): {
    status: string;
    timestamp: string;
    uptime: number;
    memoryUsage: number;
    hostname: string;
  };
  getFullHealth(redis?: any): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    memoryUsage: number;
    hostname: string;
    dependencies: {
      database: string;
      databaseError?: string;
    };
  }>;
}
