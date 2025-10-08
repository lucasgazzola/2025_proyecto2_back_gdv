import { prismaClient } from "@/config/prisma";
import { Prisma } from "@prisma/client";

import { User } from "@/models/user.model";
import { CreateUserDTO, UpdateUserDTO } from "@/dtos/user.dtos";
import { UserMapper } from "@/mappers/user.mapper";

import { IUserRepository } from "@/repositories/interfaces/user.repository.interface";

export class UserPrismaRepository implements IUserRepository {
  async createUser(data: CreateUserDTO): Promise<User> {
    // Preparar payload para Prisma: conectar role por name si se provee
    const { role, ...rest } = data as CreateUserDTO & { role?: string };
    const roleName = role ?? "USER";

    const payload: Prisma.UserCreateInput = {
      name: rest.name,
      lastname: rest.lastname,
      email: rest.email,
      password: rest.password,
      role: { connect: { name: roleName } },
    };

    const user = await prismaClient.user.create({
      data: payload,
      include: { role: true },
    });
    return UserMapper.toDomain(user);
  }
  async getUserById(id: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: { id },
      include: { role: true },
    });
    return user ? UserMapper.toDomain(user) : null;
  }
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: { email },
      include: { role: true },
    });
    return user ? UserMapper.toDomain(user) : null;
  }
  async getAllUsers(): Promise<User[]> {
    const users = await prismaClient.user.findMany({
      include: { role: true },
    });
    return users.map(UserMapper.toDomain);
  }
  async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    const { role, ...rest } = data as UpdateUserDTO & { role?: string };
    const payload: Prisma.UserUpdateInput = {};
    if (rest.name) payload.name = rest.name as any;
    if (rest.lastname) payload.lastname = rest.lastname as any;
    if (rest.email) payload.email = rest.email as any;
    if (role) payload.role = { connect: { name: role } } as any;

    const user = await prismaClient.user.update({
      where: { id },
      data: payload,
      include: { role: true },
    });
    return UserMapper.toDomain(user);
  }
  async deleteUser(id: string): Promise<void> {
    await prismaClient.user.delete({ where: { id } });
  }
}
