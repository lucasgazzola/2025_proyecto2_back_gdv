import { Inject, Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import type { IMarcaRepository } from './repositories/marca.repository.interface';
import { IMarcaRepositoryToken } from './repositories/marca.repository.interface';
import { Marca } from './marca.entity';

@Injectable()
export class MarcaService {
  constructor(
    @Inject(IMarcaRepositoryToken)
    private readonly repo: IMarcaRepository,
  ) {}

  async create(dto: CreateMarcaDto) {

    const existente = await this.repo.findByName(dto.name);
    if (existente) throw new Error('Marca ya existente');

    return this.repo.create(dto);
  }

  findAll() {
    return this.repo.findAll();
  }

  findById(id: number) {
    return this.repo.findById(id);
  }

  findByName(name: string) {
    return this.repo.findByName(name);
  }

  update(id: number, dto: UpdateMarcaDto) {
    return this.repo.update(id, dto);
  }

  async remove(id: number): Promise<Marca> {
    

    return this.repo.delete(id);
  }
}
