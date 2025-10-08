import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../dtos/auth.dtos";
import { IAuthService } from "../services/interfaces/auth.service.interface";

export class AuthController {
  constructor(private authService: IAuthService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(400)
          .json({ error: "Validation failed", details: parsed.error.issues });
      }
      const result = await this.authService.register(parsed.data);
      res.status(201).json(result);
    } catch (err: any) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(400)
          .json({ error: "Validation failed", details: parsed.error.issues });
      }
      const { token } = await this.authService.login(parsed.data);
      res.status(200).json({ token });
    } catch (err: any) {
      next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const user = await this.authService.getProfile(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (err: any) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      await this.authService.logout(req.user.id);
      res.status(204).send();
    } catch (err: any) {
      next(err);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.authService.deleteUser(id);
      res.status(204).send();
    } catch (err: any) {
      next(err);
    }
  }
}
