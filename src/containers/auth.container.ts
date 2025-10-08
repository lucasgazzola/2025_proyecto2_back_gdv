import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UserPrismaRepository } from "../repositories/prisma/user-prisma.repository";

export const authController = new AuthController(
  new AuthService(new UserPrismaRepository())
);
