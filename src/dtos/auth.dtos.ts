import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1),
  lastname: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
});
export type RegisterDTO = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
export type LoginDTO = z.infer<typeof loginSchema>;

export const logoutSchema = z.object({});
export type LogoutDTO = z.infer<typeof logoutSchema>;

export const profileSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  lastname: z.string(),
  role: z.enum(["AUDITOR", "ADMIN", "USER"]),
});
export type ProfileDto = z.infer<typeof profileSchema>;
