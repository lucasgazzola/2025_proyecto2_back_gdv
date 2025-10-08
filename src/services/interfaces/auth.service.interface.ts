import { RegisterDTO, LoginDTO, ProfileDto } from "../../dtos/auth.dtos";
import { User } from "../../models/user.model";

export interface IAuthService {
  login(dto: LoginDTO): Promise<{ token: string }>;
  register(dto: RegisterDTO): Promise<{ token: string }>;
  logout(userId: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  getProfile(userId: string): Promise<ProfileDto | null>;
}
