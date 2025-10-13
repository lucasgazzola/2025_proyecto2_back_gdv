import { Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MarcaRepository } from './marca.repository';
import { ProductoRepository } from '../producto/producto.repository';

@Injectable()
export class MarcaService {
  constructor(
    private readonly repo: MarcaRepository,
    private readonly productoRepo: ProductoRepository,
  ) {}

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

  async remove(id: number): Promise<void> {
    const productos = await this.productoRepo.findAll();
    const asoaciados = productos.filter(p => p.marca.id === id);

    if (asoaciados.length > 0) throw new Error('No se puede eliminar la marca, ya tiene productos asoaciados');

    return this.repo.delete(id);
  }
}
