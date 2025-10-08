import pino from "pino";
import { env } from "./env";

let level: pino.Level = "info";

if (env.NODE_ENV === "dev") {
  level = "debug";
} else if (env.NODE_ENV === "test") {
  level = "error"; // menos ruido en test
}

export const logger = pino({
  level,
  timestamp: pino.stdTimeFunctions.isoTime,
  base: undefined, // No incluir pid/hostname por defecto
  transport:
    env.NODE_ENV === "dev"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
            singleLine: true,
          },
        }
      : undefined,
});
