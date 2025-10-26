import { UsuarioMapper } from '../../usuario/mapper/prisma-usuario.mapper';
import { ClienteMapper } from '../../cliente/mapper/prisma-cliente.mapper';
import { ProductoMapper } from '../../producto/mapper/prisma-producto.mapper';
import {
  IFacturaCalculada,
  IFacturaItemCalculada,
} from '../factura-calculada.interface';

export class FacturaItemMapper {
  static toDomain(facturaItem: any) {
    return {
      id: facturaItem.id,
      invoiceId: facturaItem.invoiceId,
      productId: facturaItem.productId,
      product: facturaItem.product
        ? ProductoMapper.toDomain(facturaItem.product)
        : undefined,
      quantity: facturaItem.quantity,
      unitPrice: facturaItem.unitPrice,
      subtotal: facturaItem.subtotal,
    };
  }

  static toCreatePersistence(facturaItem: IFacturaItemCalculada) {
    return {
      product: { connect: { id: facturaItem.productId } },
      quantity: facturaItem.quantity,
      unitPrice: facturaItem.unitPrice,
      subtotal: facturaItem.subtotal,
    };
  }
}

export class FacturaMapper {
  static toDomain(factura: any) {
    return {
      id: factura.id,
      invoiceNumber: factura.invoiceNumber,
      userId: factura.userId,
      user: factura.user ? UsuarioMapper.toDomain(factura.user) : undefined,
      customerId: factura.customerId,
      customer: factura.customer
        ? ClienteMapper.toDomain(factura.customer)
        : undefined,
      state: factura.state,
      invoiceDetails: factura.items
        ? factura.items.map((item) => FacturaItemMapper.toDomain(item))
        : [],
      total: factura.total,
      createdAt: factura.createdAt,
      updatedAt: factura.updatedAt,
    };
  }

  static toCreatePersistence(data: IFacturaCalculada): any {
    return {
      invoiceNumber: String(data.invoiceNumber),
      user: data.userId ? { connect: { id: data.userId } } : undefined,
      customer: data.customerId
        ? { connect: { id: data.customerId } }
        : undefined,
      items: {
        create: data.items.map((item) =>
          FacturaItemMapper.toCreatePersistence(item),
        ),
      },
      total: data.total,
    };
  }
}
