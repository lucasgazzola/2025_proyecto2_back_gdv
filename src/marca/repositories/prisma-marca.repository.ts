import { Injectable } from "@nestjs/common";
import { IMarcaRepository } from "./marca.repository.interface";
import { CreateMarcaDto } from "../dto/create-marca.dto";
import { Marca } from "../marca.entity";
import { MarcaMapper } from "../mapper/prisma-marca.mapper";
import { prisma } from "../../common/config/db-client";
import { UpdateMarcaDto } from "../dto/update-marca.dto";

@Injectable()
export class PrismaMarcaRepository implements IMarcaRepository {

    async create(createMarcaDto: CreateMarcaDto): Promise<Marca> {

        const marca = await prisma.brand.create({ data: MarcaMapper.toCreatePersistence(createMarcaDto), });

        return MarcaMapper.toDomain(marca);
    }
    
    async update(id: number, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {

        const marca = await prisma.brand.update({ where: { id }, data: MarcaMapper.toUpdatePersistence(updateMarcaDto), });

        return MarcaMapper.toDomain(marca);
    }

    async delete(id: number): Promise<Marca> {

        const marca =await prisma.brand.delete({ where: { id }, });

        return MarcaMapper.toDomain(marca);

    }

    async findAll(): Promise<Marca[]> {
        
        const marcas = await prisma.brand.findMany();

        return marcas.map(MarcaMapper.toDomain);
    }

    async findById(id: number): Promise<Marca | null> {

        const marca = await prisma.brand.findUnique({ where: { id }, });

        return marca ? MarcaMapper.toDomain(marca) : null;
    }

    async findByName(name: string): Promise<Marca | null> {

        const marca = await prisma.brand.findUnique({ where: { name }, });

        return marca ? MarcaMapper.toDomain(marca) : null;
    }

}