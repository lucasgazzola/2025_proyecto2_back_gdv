import { Injectable } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { Factura } from './factura.interface';
import { FacturaItem } from './factura-item.interface';
import { FacturaRepository } from './factura.repository';
import { ProductoRepository } from '../producto/producto.repository';
import { UsuarioRepository } from '../usuario/usuario.repository';

@Injectable()
export class FacturaService {
  constructor(
    private readonly facturaRepo: FacturaRepository,
    private readonly productoRepo: ProductoRepository,
    private readonly usuarioRepo: UsuarioRepository,
  ) {}

  async create(dto: CreateFacturaDto): Promise<Factura> {

    if (!dto.items || dto.items.length === 0) {
      throw new Error('La factura debe tener al menos un producto');
    }

    const usuario = await this.usuarioRepo.findById(dto.usuarioId);
    if (!usuario) throw new Error('Usuario no encontrado');

    const items: FacturaItem[] = [];

    for (const itemDto of dto.items) {
      const producto = await this.productoRepo.findById(itemDto.productoId);
      if (!producto) throw new Error(`Producto con ID ${itemDto.productoId} no encontrado`);

      const precioUnitario = producto.precio;
      const total = precioUnitario * itemDto.cantidad;

      items.push({
        producto,
        cantidad: itemDto.cantidad,
        precioUnitario,
        total,
      });
    }

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const total = subtotal;

    return this.facturaRepo.create({
      usuario,
      fecha: new Date(),
      items,
      subtotal,
      total,
    });
  }

  findAll() {
    return this.facturaRepo.findAll();
  }

  findOne(id: number) {
    return this.facturaRepo.findById(id);
  }
}
