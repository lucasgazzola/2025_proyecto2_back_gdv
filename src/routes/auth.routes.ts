import { Router } from "express";

import { authController } from "@/containers/auth.container";
import { authMiddleware } from "@/middlewares/authMiddleware";

const router = Router();

router.delete(
  "/:id",
  authMiddleware,
  authController.deleteUser.bind(authController)
);
router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.get("/me", authMiddleware, authController.me.bind(authController));
router.post(
  "/logout",
  authMiddleware,
  authController.logout.bind(authController)
);

export default router;
