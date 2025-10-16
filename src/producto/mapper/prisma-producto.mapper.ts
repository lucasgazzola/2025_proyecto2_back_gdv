import { Producto } from '../producto.entity';
import { MarcaMapper } from 'src/marca/mapper/prisma-marca.mapper';
import { CategoriaMapper } from 'src/categoria/mapper/prisma-categoria.mapper';
import { ProveedorMapper } from 'src/proveedor/mapper/prisma-proveedor.mapper';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';
import { Product as PrismaProduct } from '@prisma/client';
import { Prisma } from '@prisma/client';

type PrismaProductInput = PrismaProduct & {
  brand?: { id: number; name: string; createdAt: Date; updatedAt: Date } | null;
  categories?: Array<{ id: number; name: string; description?: string; createdAt: Date; updatedAt: Date }>;
  provider?: { id: number; name: string; createdAt: Date; updatedAt: Date } | null;
};

export class ProductoMapper {

    static toDomain(producto: any): Producto {
        return {
            id: producto.id,
            name: producto.name,
            price: producto.price,
            stock: producto.stock,
            description: producto.description,
            imagesURL: producto.imagesURL || [],
            brandId: producto.brandId,
            brand: producto.brand ? MarcaMapper.toDomain(producto.brand) : undefined,
            categories: producto.categories ? producto.categories.map(c => CategoriaMapper.toDomain(c)) : [],
            providerId: producto.providerId,
            provider: producto.provider ? ProveedorMapper.toDomain(producto.provider) : undefined,
            createdAt: producto.createdAt,
            updatedAt: producto.updatedAt,
        };
    }

    static toCreatePersistence(data: CreateProductoDto): any {
        return {
            name: data.name,
            price: data.price,
            stock: data.stock ?? 0,
            imagesURL: data.imagesURL,
            brand: data.brandId ? { connect: { id: data.brandId } } : undefined,
            categories: {
                connect: (data.categoryIds ?? []).map((id) => ({id})),
            },
            provider: data.providerId ? { connect: { id: data.providerId } } : undefined
        };
    }

    static toUpdatePersistence(dto: UpdateProductoDto): any {

        const data: Prisma.ProductUpdateInput = {};

        if (dto.name !== undefined) data.name = dto.name;
        if (dto.price !== undefined) data.price = dto.price;
        if (dto.stock !== undefined) data.stock = dto.stock;
        if (dto.imagesURL !== undefined) data.imagesURL = dto.imagesURL;
        if (dto.brandId !== undefined) data.brand = dto.brandId ? { connect: { id: dto.brandId } } : { disconnect: true };
        if (dto.categoryIds !== undefined) data.categories = { set: (dto.categoryIds ?? []).map((id) => ({id})) };
        if (dto.providerId !== undefined) data.provider = dto.providerId ? { connect: { id: dto.providerId } } : { disconnect: true };

        return data;
    }

}