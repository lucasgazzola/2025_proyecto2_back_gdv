import { User } from "../usuario.entity";
import { IUsuarioRepository } from "./usuario.repository.interface";
import { prisma } from "src/common/config/db-client";
import { UsuarioMapper } from "../mapper/prisma-usuario.mapper";
import { CreateUsuarioDto } from "../dto/create-usuario.dto";
import { UpdateUsuarioDto } from "../dto/update-usuario.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaUsuarioRepository implements IUsuarioRepository {

    async findAll(): Promise<User[]> {

        const users = await prisma.user.findMany();

        return users.map(UsuarioMapper.toDomain);
        
    }

    async findByEmail(email: string): Promise<User | null> {
        
        const user = await prisma.user.findUnique({ where: { email } });

        return user ? UsuarioMapper.toDomain(user) : null;
    }

    async findByEmailWithPassword(email: string): Promise<any> {

        const user = await prisma.user.findUnique({ where: { email } });

        return user;
    }

    async findById(id: number): Promise<User | null> {

        const user = await prisma.user.findUnique({ where: { id } });

        return user ? UsuarioMapper.toDomain(user) : null;
    }

    async create(data: CreateUsuarioDto): Promise<User> {

        const user = await prisma.user.create({ data: UsuarioMapper.toCreatePersistance(data) });

        return UsuarioMapper.toDomain(user);
    }

    async update(id: number, data: UpdateUsuarioDto): Promise<User> {

        const user = await prisma.user.update({ where: { id }, data: UsuarioMapper.toUpdatePersistance(data) });
        
        return UsuarioMapper.toDomain(user);
    }

    async delete(id: number): Promise<User> {

        const user = await prisma.user.delete({ where: { id } });

        return UsuarioMapper.toDomain(user);
    }


}