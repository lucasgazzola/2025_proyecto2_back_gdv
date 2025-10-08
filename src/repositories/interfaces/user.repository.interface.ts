import { User } from "@/models/user.model";
import { CreateUserDTO, UpdateUserDTO } from "@/dtos/user.dtos";

export interface IUserRepository {
  createUser(data: CreateUserDTO): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, data: UpdateUserDTO): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
