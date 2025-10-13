import { Injectable } from '@nestjs/common';
import { Factura } from './factura.interface';

@Injectable()
export class FacturaRepository {
  private facturas: Factura[] = [];
  private idCounter = 1;

  async create(factura: Omit<Factura, 'id'>): Promise<Factura> {
    const nueva = { id: this.idCounter++, ...factura };
    this.facturas.push(nueva);
    return nueva;
  }

  findAll(): Factura[] {
    return this.facturas;
  }

  findById(id: number): Factura | null {
    return this.facturas.find(f => f.id === id) ?? null;
  }
}