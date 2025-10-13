import { Injectable } from '@nestjs/common';
import { Categoria } from './categoria.interface';
import { CategoriaRepository } from './categoria.repository';

@Injectable()
export class CategoriaService {
  constructor(private readonly repo: CategoriaRepository) {}

  findAll(): Categoria[] {
    return this.repo.findAll();
  }

  findById(id: number): Categoria | null {
    return this.repo.findById(id);
  }
}