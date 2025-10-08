import { ProfileDto } from "@/dtos/auth.dtos";
import { User } from "../models/user.model";
import { Prisma } from "@prisma/client";

export class UserMapper {
  static toDomain(
    prismaUser: Prisma.UserGetPayload<{ include: { role: true } }>
  ): User {
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      name: prismaUser.name,
      lastname: prismaUser.lastname,
      password: prismaUser.password,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      role: {
        name: prismaUser.role.name,
      },
    };
  }

  static toPersistence(user: User): Prisma.UserCreateInput {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: { connect: { name: user.role.name } },
    } as Prisma.UserCreateInput;
  }

  static toProfileDto(user: User): ProfileDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      role: user.role.name as "AUDITOR" | "ADMIN" | "USER",
    };
  }
}
