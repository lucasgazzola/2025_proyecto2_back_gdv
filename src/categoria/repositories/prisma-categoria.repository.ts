import { ICategoriaRepository } from './categoria.repository.interface';
import { Categoria } from '../categoria.entity';
import { prisma } from '../../common/config/db-client';
import { CategoriaMapper } from '../mapper/prisma-categoria.mapper';
import { Injectable } from '@nestjs/common';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';

@Injectable()
export class PrismaCategoriaRepository implements ICategoriaRepository {
  // La categoria no se puede repetir por nombre (unique)

  async findByName(name: string): Promise<Categoria | null> {
    const categoria = await prisma.category.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: 'insensitive',
        },
      },
    });
    return categoria ? CategoriaMapper.toDomain(categoria) : null;
  }

  async create(categoria: CreateCategoriaDto): Promise<Categoria> {
    const created = await prisma.category.create({
      data: {
        name: categoria.name.trim(),
        description: categoria.description?.trim(),
      },
    });

    return CategoriaMapper.toDomain(created);
  }

  async update(id: number, categoria: UpdateCategoriaDto): Promise<Categoria> {
    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: categoria.name?.trim(),
        description: categoria.description?.trim(),
      },
    });

    return CategoriaMapper.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }

  async findAll(): Promise<Categoria[]> {
    const categorias = await prisma.category.findMany();
    return categorias.map(CategoriaMapper.toDomain);
  }

  async findById(id: number): Promise<Categoria | null> {
    return await prisma.category.findUnique({ where: { id } });
  }
}
