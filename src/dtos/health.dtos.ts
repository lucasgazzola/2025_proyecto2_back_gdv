import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
});
export type HealthResponseDTO = z.infer<typeof healthResponseSchema>;

export const metricsResponseSchema = z.object({
  uptime: z.number(),
  memoryUsage: z.number(),
  requestCount: z.number(),
});
export type MetricsResponseDTO = z.infer<typeof metricsResponseSchema>;
