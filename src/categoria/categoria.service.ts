import { Inject, Injectable } from '@nestjs/common';
import { Categoria } from './categoria.entity';
import { ICategoriaRepositoryToken } from './repositories/categoria.repository.interface';
import type{ ICategoriaRepository } from './repositories/categoria.repository.interface';


@Injectable()
export class CategoriaService {
  
  constructor(
    @Inject(ICategoriaRepositoryToken) 
    private readonly repo: ICategoriaRepository,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return await this.repo.findAll();
  }

  async findById(id: number): Promise<Categoria | null> {

    const categoria = await this.repo.findById(id);
    if (!categoria) throw new Error('Categoría no encontrada');

    return categoria;
  }
}