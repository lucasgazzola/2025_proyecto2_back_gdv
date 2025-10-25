import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Categoria } from './categoria.entity';
import { ICategoriaRepositoryToken } from './repositories/categoria.repository.interface';
import type { ICategoriaRepository } from './repositories/categoria.repository.interface';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

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
    if (!categoria) throw new BadRequestException('Categoría no encontrada');

    return categoria;
  }

  async create(createCategoryDto: CreateCategoriaDto): Promise<Categoria> {
    const existing = await this.repo.findByName(createCategoryDto.name.trim());
    if (existing) {
      throw new BadRequestException('Categoría con este nombre ya existe');
    }
    return await this.repo.create(createCategoryDto);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new BadRequestException('Categoría no encontrada');
    }

    if (updateCategoryDto.name) {
      const duplicate = await this.repo.findByName(
        updateCategoryDto.name.trim(),
      );
      if (duplicate && duplicate.id !== id) {
        throw new BadRequestException('Categoría con este nombre ya existe');
      }
    }

    return await this.repo.update(id, updateCategoryDto);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing || !existing.isActive) {
      throw new BadRequestException('Categoría no encontrada');
    }
    return await this.repo.delete(id);
  }
}
