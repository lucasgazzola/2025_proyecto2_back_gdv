import dotenv from "dotenv";
import { z } from "zod";

// Cargar el .env correspondiente según NODE_ENV antes de parsear
dotenv.config({
  path:
    process.env.NODE_ENV === "test"
      ? ".env.test"
      : process.env.NODE_ENV === "dev"
      ? ".env.dev"
      : ".env",
});

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().url(),
  URL_SERVER: z.string().url().default("http://localhost"),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default("15m"),
});

export const env = envSchema.parse(process.env);
