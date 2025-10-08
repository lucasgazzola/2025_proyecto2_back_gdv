import dotenv from "dotenv";

// Cargar el .env correspondiente según NODE_ENV
dotenv.config({
  path:
    process.env.NODE_ENV === "test"
      ? ".env.test"
      : process.env.NODE_ENV === "dev"
      ? ".env.dev"
      : ".env",
});

import { createApp } from "./app";
import { logger } from "./config/logger";
import { env } from "./config/env";
import { prismaClient } from "./config/prisma";

const app = createApp();

const PORT = env.PORT;
const URL_SERVER = env.URL_SERVER;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on ${URL_SERVER}:${PORT}`);
});

async function gracefulShutdown(signal: string) {
  logger.info(`🛑 ${signal} received, shutting down...`);
  server.close(async () => {
    try {
      logger.info("🔌 Disconnecting Prisma...");
      await prismaClient.$disconnect();
      logger.info("🔌 Prisma disconnected");
    } catch (err) {
      logger.error(
        "Error disconnecting Prisma: " +
          (err instanceof Error ? err.message : String(err))
      );
    }
    logger.info("✅ Server closed");
    process.exit(0);
  });
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
