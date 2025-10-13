import { Injectable } from '@nestjs/common';
import { Producto } from './producto.interface';


@Injectable()
export class ProductoRepository {
  private productos: Producto[] = [];
  private id = 1;

  async create(data: Omit<Producto, 'id'>): Promise<Producto> {
    const nuevo = { id: this.id++, ...data };
    this.productos.push(nuevo);
    return nuevo;
  }

  async findAll(): Promise<Producto[]> {
    return this.productos;
  }

  async findById(id: number): Promise<Producto | null> {
    return this.productos.find(p => p.id === id) ?? null;
  }

  async update(id: number, data: Partial<Producto>): Promise<Producto> {
    const producto = await this.findById(id);
    if (!producto) throw new Error('Producto no encontrado');

    Object.assign(producto, data);
    return producto;
  }

  async delete(id: number): Promise<void> {
    const index = this.productos.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Producto no encontrado');
    this.productos.splice(index, 1);
  }
}