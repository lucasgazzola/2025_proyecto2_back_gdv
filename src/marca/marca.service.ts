import { Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MarcaRepository } from './marca.repository';

@Injectable()
export class MarcaService {
  constructor(private readonly repo: MarcaRepository) {}

  async create(dto: CreateMarcaDto) {

    const existente = await this.repo.findByName(dto.nombre);
    if (existente) throw new Error('Marca ya existente');

    return this.repo.create(dto);
  }

  findAll() {
    return this.repo.findMany();
  }

  findOne(id: number) {
    return this.repo.findById(id);
  }

  update(id: number, dto: UpdateMarcaDto) {
    return this.repo.update(id, dto);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
