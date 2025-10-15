import { ICategoriaRepository } from "./categoria.repository.interface";
import { Categoria } from "../categoria.entity";
import { prisma } from "../../common/config/db-client";
import { CategoriaMapper } from "../mapper/prisma-categoria.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaCategoriaRepository implements ICategoriaRepository{

    async findAll(): Promise<Categoria[]> {

        const categorias = await prisma.category.findMany();

        return categorias.map(CategoriaMapper.toDomain)
    }

    async findById(id: number): Promise<Categoria | null> {
        const categoria = await prisma.category.findUnique({ where: { id } });
        
        return categoria ? CategoriaMapper.toDomain(categoria) : null;
    }
}