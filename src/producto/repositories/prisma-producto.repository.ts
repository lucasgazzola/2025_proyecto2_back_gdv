import { Injectable } from "@nestjs/common";
import { IProductoRepository } from "./producto.repository.interface";
import { Producto } from "../producto.entity";
import { prisma } from "src/common/config/db-client";
import { ProductoMapper } from "../mapper/prisma-producto.mapper";
import { CreateProductoDto } from "../dto/create-producto.dto";
import { UpdateProductoDto } from "../dto/update-producto.dto";

@Injectable()
export class PrismaProductoRepository implements IProductoRepository {

    async findAll(): Promise<Producto[]> {

        const productos = await prisma.product.findMany({
            include: {
                brand: true,
                categories: true,
                provider: true
            }
        });
        return productos.map(ProductoMapper.toDomain);
    }

    async findById(id: number): Promise<Producto | null> {

        const producto = await prisma.product.findUnique({ 
            where: { id },
            include: {
                brand: true,
                categories: true,
                provider: true
            }
        });

        return producto ? ProductoMapper.toDomain(producto) : null;
        
    }

    async findByIds(ids: number[]): Promise<Producto[]> {

        const productos = await prisma.product.findMany({ 
            where: { id: { in: ids } },
            include: {
                brand: true,
                categories: true,
                provider: true
            }
        });

        return productos.map(ProductoMapper.toDomain);
    }

    async create(createProductoDto: CreateProductoDto): Promise<Producto> {

        const producto = await prisma.product.create({
            data: ProductoMapper.toCreatePersistence(createProductoDto),
            include: {
                brand: true,
                categories: true,
                provider: true
            }
        });

        return ProductoMapper.toDomain(producto);
    }

    async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {

        const producto = await prisma.product.update({ 
            where: { id }, 
            data: ProductoMapper.toUpdatePersistence(updateProductoDto),
            include: {
                brand: true,
                categories: true,
                provider: true
            } 
        });

        return ProductoMapper.toDomain(producto);
    }

    async delete(id: number): Promise<Producto> {

        const producto = await prisma.product.delete({ where: { id } });

        return ProductoMapper.toDomain(producto);
    }
}