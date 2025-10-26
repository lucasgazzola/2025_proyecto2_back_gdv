import { CreateFacturaDto } from '../dto/create-factura.dto';
import { Factura } from '../factura.entity';
import { FacturaMapper } from '../mapper/prisma-factura.mapper';
import { IFacturaRepository } from './factura.repository.interface';
import { prisma } from '../../common/config/db-client';
import { Prisma } from '@prisma/client';

export class PrismaFacturaRepository implements IFacturaRepository {
  async findAll(): Promise<Factura[]> {
    const facturas = await prisma.invoice.findMany({
      include: {
        user: true,
        customer: true,
        items: {
          include: {
            product: {
              include: { categories: true, brand: true },
            },
          },
        },
      },
    });

    return facturas.map(FacturaMapper.toDomain);
  }

  async findById(id: number): Promise<Factura | null> {
    const factura = await prisma.invoice.findUnique({
      where: { id },
      include: {
        user: true,
        customer: true,
        items: { include: { product: true } },
      },
    });

    return FacturaMapper.toDomain(factura);
  }

  async create(dto: any): Promise<Factura> {
    // Ejecutar en transacción: decrementar stock de productos y crear la factura
    const ops: Prisma.PrismaPromise<any>[] = [];

    // primero, operaciones de decremento por cada item
    for (const item of dto.items) {
      ops.push(
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        }) as Prisma.PrismaPromise<any>,
      );
    }

    // luego la creación de la factura
    ops.push(
      prisma.invoice.create({
        data: FacturaMapper.toCreatePersistence(dto),
        include: {
          user: true,
          customer: true,
          items: { include: { product: true } },
        },
      }) as Prisma.PrismaPromise<any>,
    );

    const results = await prisma.$transaction(ops);
    // el último resultado es la factura creada
    const factura = results[results.length - 1];
    return FacturaMapper.toDomain(factura);
  }

  async updateState(id: number, state: 'PAID' | 'CANCELLED'): Promise<Factura> {
    // Obtener factura con items
    const factura = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!factura) throw new Error('Factura no encontrada');

    if (factura.state !== 'PENDING') {
      throw new Error('Solo se permiten transiciones desde PENDING');
    }

    if (state === 'PAID') {
      const updated = await prisma.invoice.update({
        where: { id },
        data: { state: 'PAID' },
        include: {
          user: true,
          customer: true,
          items: { include: { product: true } },
        },
      });
      return FacturaMapper.toDomain(updated);
    }

    // state === 'CANCELLED' -> restaurar stock y actualizar estado en transacción
    const ops: Prisma.PrismaPromise<any>[] = [];
    for (const item of factura.items) {
      ops.push(
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        }) as Prisma.PrismaPromise<any>,
      );
    }

    ops.push(
      prisma.invoice.update({
        where: { id },
        data: { state: 'CANCELLED' },
        include: {
          user: true,
          customer: true,
          items: { include: { product: true } },
        },
      }) as Prisma.PrismaPromise<any>,
    );

    const results = await prisma.$transaction(ops);
    const updatedInvoice = results[results.length - 1];
    return FacturaMapper.toDomain(updatedInvoice);
  }

  async delete(id: number): Promise<Factura> {
    const factura = await prisma.invoice.delete({
      where: { id },
      include: {
        user: true,
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return FacturaMapper.toDomain(factura);
  }
}
