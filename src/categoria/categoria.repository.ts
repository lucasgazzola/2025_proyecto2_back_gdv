import { Injectable } from '@nestjs/common';
import { Categoria } from './categoria.entity';
import { prisma } from '../common/config/db-client';

@Injectable()
export class CategoriaRepository {
  private readonly categorias: Categoria[] = [];

  async findAll(): Promise<Categoria[]> {
    return await prisma.category.findMany();
  }

  async findById(id: number): Promise<Categoria | null> {
    return await prisma.category.findUnique({ where: { id } });
  }

  async findByNombre(name: string): Promise<Categoria | null> {
    return await prisma.category.findUnique({ where: { name } });
  }
}