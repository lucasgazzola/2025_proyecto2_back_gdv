import { Injectable } from '@nestjs/common';
import { Marca } from './marca.interface';

@Injectable()
export class MarcaRepository {
  private marcas: Marca[] = [];
  private idCounter = 1;

  async create(data: { nombre: string; descripcion?: string }): Promise<Marca> {
    const nueva = { id: this.idCounter++, ...data };
    this.marcas.push(nueva);
    return nueva;
  }

  async findMany(): Promise<Marca[]> {
    return this.marcas;
  }

  async findById(id: number): Promise<Marca | null> {
    return this.marcas.find(m => m.id === id) ?? null;
  }

  async findByName(nombre: string): Promise<Marca | null> {
  return this.marcas.find(m => m.nombre.toLowerCase() === nombre.toLowerCase()) ?? null;
}

  async update(id: number, data: Partial<Marca>): Promise<Marca> {
    const marca = await this.findById(id);
    if (!marca) throw new Error('Marca no encontrada');

    Object.assign(marca, data);
    return marca;
  }

  async delete(id: number): Promise<void> {
    const index = this.marcas.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Marca no encontrada');
    this.marcas.splice(index, 1);
  }
}