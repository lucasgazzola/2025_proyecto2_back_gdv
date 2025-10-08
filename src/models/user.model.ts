import { Role } from "./role.model";

export interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
}
