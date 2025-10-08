import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "@/config/env";

import { RegisterDTO, LoginDTO, ProfileDto } from "@/dtos/auth.dtos";
import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";

import { NotFoundError } from "@/exceptions/db/NotFoundError";
import { BadRequestException } from "@/exceptions/http/BadRequestException";

import { IAuthService } from "./interfaces/auth.service.interface";
import { UserMapper } from "@/mappers/user.mapper";

const JWT_SECRET = env.JWT_SECRET || "your_jwt_secret_key";

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  deleteUser(userId: string): Promise<void> {
    return this.userRepository.deleteUser(userId);
  }

  async login(dto: LoginDTO): Promise<{ token: string }> {
    const user = await this.userRepository.getUserByEmail(dto.email);
    if (!user) throw new BadRequestException("Invalid credentials");
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new BadRequestException("Invalid credentials");
    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      role: user.role.name,
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "15m",
    });
    return { token };
  }

  async register(dto: RegisterDTO): Promise<{ token: string }> {
    const existing = await this.userRepository.getUserByEmail(dto.email);
    if (existing) throw new BadRequestException("Invalid credentials");
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.createUser({
      email: dto.email,
      name: dto.name,
      lastname: dto.lastname,
      password: hashed,
    });
    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      role: user.role.name,
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "1d",
    });
    // No devolver la contraseña en la respuesta
    return { token };
  }

  async getProfile(userId: string): Promise<ProfileDto | null> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new NotFoundError(`User with id ${userId} not found.`);
    return UserMapper.toProfileDto(user);
  }

  async logout(_userId: string): Promise<void> {
    // Si usas JWT, el logout es del lado del cliente. Si usas sesiones, aquí puedes invalidar.
    return;
  }
}
