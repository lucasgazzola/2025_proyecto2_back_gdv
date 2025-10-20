import { Injectable } from "@nestjs/common";
import { Proveedor } from "../proveedor.entity";
import { prisma } from "src/common/config/db-client";
import { ProveedorMapper } from "../mapper/prisma-proveedor.mapper";
import { IProveedorRepository } from "./proveedor.repository.interface";


@Injectable()
export class PrismaProveedorRepository implements IProveedorRepository {

    async findAll(): Promise<Proveedor[]> {

        const proveedores = await prisma.provider.findMany();

        return proveedores.map(ProveedorMapper.toDomain);
    }

    async findById(id: number): Promise<Proveedor | null> {

        const proveedor = await prisma.provider.findUnique({ where: { id } });

        return proveedor ? ProveedorMapper.toDomain(proveedor) : null;
    }
}