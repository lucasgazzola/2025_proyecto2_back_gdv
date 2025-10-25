import { Injectable } from '@nestjs/common';
import { Proveedor } from '../proveedor.entity';
import { prisma } from 'src/common/config/db-client';
import { ProveedorMapper } from '../mapper/prisma-proveedor.mapper';
import { IProveedorRepository } from './proveedor.repository.interface';
import { UpdateProductoDto } from 'src/producto/dto/update-producto.dto';
import { CreateProveedorDto } from '../dto/create-proveedor.dto';

@Injectable()
export class PrismaProveedorRepository implements IProveedorRepository {
  async findByEmail(email: string): Promise<Proveedor | null> {
    const proveedor = await prisma.provider.findUnique({
      where: { email },
    });

    if (!proveedor) {
      return null;
    }

    return ProveedorMapper.toDomain(proveedor);
  }
  async findByCode(code: string): Promise<Proveedor | null> {
    const proveedor = await prisma.provider.findUnique({
      where: { code },
    });

    if (!proveedor) {
      return null;
    }

    return ProveedorMapper.toDomain(proveedor);
  }
  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    const proveedor = await prisma.provider.create({
      data: ProveedorMapper.toPersistence(createProveedorDto),
    });

    return ProveedorMapper.toDomain(proveedor);
  }

  async update(
    id: number,
    updateProveedorDto: UpdateProductoDto,
  ): Promise<Proveedor> {
    const proveedor = await prisma.provider.update({
      where: { id },
      data: ProveedorMapper.toUpdatePersistence(updateProveedorDto),
    });

    return ProveedorMapper.toDomain(proveedor);
  }

  async delete(id: number): Promise<void> {
    await prisma.provider.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async findAll(): Promise<Proveedor[]> {
    const proveedores = await prisma.provider.findMany({
      where: { isActive: true },
    });

    return proveedores.map(ProveedorMapper.toDomain);
  }

  async findById(id: number): Promise<Proveedor | null> {
    const proveedor = await prisma.provider.findUnique({ where: { id } });

    if (!proveedor || !proveedor.isActive) {
      return null;
    }

    return proveedor ? ProveedorMapper.toDomain(proveedor) : null;
  }
}
