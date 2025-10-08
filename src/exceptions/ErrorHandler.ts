import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";
import {
  NotFoundError,
  UnknownDatabaseError,
  ValidationError as DbValidationError,
  DatabaseConnectionError,
} from "./db";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "./http";

export abstract class ErrorHandler {
  static handle = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    logger.info("Error middleware triggered");

    // ===== Zod validation errors =====
    if (err instanceof ZodError) {
      logger.warn({ errors: err.issues }, "Validation error");
      return res
        .status(400)
        .json({ error: "Validation failed", details: err.issues });
    }

    // ===== HTTP Exceptions =====
    if (
      err instanceof BadRequestException ||
      err instanceof UnauthorizedException ||
      err instanceof NotFoundException
    ) {
      logger.warn({ err }, "HTTP Exception");
      return res.status(err.statusCode).json({ error: err.message });
    }

    // ===== Database Errors =====
    if (err instanceof NotFoundError) {
      logger.warn({ err }, "Resource not found (DB)");
      return res.status(404).json({ error: err.message });
    }

    if (err instanceof DbValidationError) {
      logger.warn({ err }, "Database validation error");
      return res.status(400).json({ error: err.message });
    }

    if (err instanceof DatabaseConnectionError) {
      logger.error({ err }, "Database connection error");
      return res.status(500).json({ error: "Database connection error" });
    }

    if (err instanceof UnknownDatabaseError) {
      logger.error({ err }, "Unknown database error");
      return res.status(500).json({ error: err.message });
    }

    // ===== Fallback =====
    logger.error({ err }, "Unexpected error");
    return res.status(500).json({ error: "Internal server error" });
  };
}
