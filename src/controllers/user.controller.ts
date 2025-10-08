import { Request, Response, NextFunction } from "express";
// Aquí iría el UserService cuando lo implementes

export class UserController {
  // constructor(private userService: UserService) {}

  async getAll(_req: Request, res: Response, next: NextFunction) {
    // Implementar lógica de consulta de usuarios
    res.status(501).json({ error: "Not implemented" });
  }
}
