import { Inject, Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import type { IMarcaRepository } from './repositories/marca.repository.interface';
import { IMarcaRepositoryToken } from './repositories/marca.repository.interface';
import { ProductoRepository } from '../producto/producto.repository';
import { Marca } from './marca.entity';

@Injectable()
export class MarcaService {
  constructor(
    @Inject(IMarcaRepositoryToken)
    private readonly repo: IMarcaRepository,
    private readonly productoRepo: ProductoRepository,
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

    const productos = await this.productoRepo.findAll();
    const asoaciados = productos.filter(p => p.marca.id === id);

    if (asoaciados.length > 0) throw new Error('No se puede eliminar la marca, ya tiene productos asoaciados');

    return this.repo.delete(id);
  }
}
