import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IFacturaRepositoryToken } from './repositories/factura.repository.interface';
import type { IFacturaRepository } from './repositories/factura.repository.interface';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { FacturaValidatorHelper } from './helpers/factura-validator.helper';
import { IFacturaItemCalculada } from './factura-calculada.interface';
import { IProductoRepositoryToken } from '../producto/repositories/producto.repository.interface';
import type { IProductoRepository } from '../producto/repositories/producto.repository.interface';
import { FacturaCalculatorHelper } from './helpers/factura-calculator.helper';
import { IFacturaCalculada } from './factura-calculada.interface';
import { IUsuarioRepositoryToken } from '../usuario/repositories/usuario.repository.interface';
import type { IUsuarioRepository } from '../usuario/repositories/usuario.repository.interface';
import {
  type IClienteRepository,
  IClienteRepositoryToken,
} from '../cliente/repositories/cliente.repository.interface';

@Injectable()
export class FacturaService {
  constructor(
    @Inject(IFacturaRepositoryToken)
    private readonly repo: IFacturaRepository,
    @Inject(IProductoRepositoryToken)
    private readonly productoRepo: IProductoRepository,
    @Inject(IUsuarioRepositoryToken)
    private readonly userRepo: IUsuarioRepository,
    @Inject(IClienteRepositoryToken)
    private readonly customerRepo: IClienteRepository,
  ) {}

  findAll() {
    return this.repo.findAll();
  }

  findById(id: number) {
    return this.repo.findById(id);
  }

  async create(dto: CreateFacturaDto, userEmail: string) {
    const user = await this.userRepo.findByEmail(userEmail);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // el cliente puede venir como `customerId` o como `customer: { id }`
    const customerId = dto.customerId ?? dto.customer?.id;
    if (!customerId) {
      throw new BadRequestException('Cliente no especificado');
    }

    const customer = await this.customerRepo.findById(Number(customerId));
    if (!customer) {
      throw new BadRequestException('Cliente no encontrado');
    }

    FacturaValidatorHelper.validarItems(dto.invoiceDetails);

    for (const item of dto.invoiceDetails) {
      FacturaValidatorHelper.validarCantidad(item.quantity);
    }

    // Normalizar y validar product ids desde invoiceDetails
    const productIds: number[] = [];
    dto.invoiceDetails.forEach((i, idx) => {
      // varios formatos posibles: i.product.id, i.productId, i.id (p.e. "14-1761443148092")
      let pidRaw: any = undefined;
      if (i && i.product) pidRaw = i.product.id ?? i.product;
      pidRaw = pidRaw ?? (i as any).productId ?? (i as any).id;

      if (pidRaw === null || pidRaw === undefined) {
        throw new BadRequestException(
          `Producto id faltante en invoiceDetails[${idx}]`,
        );
      }

      // si viene con formato "<id>-<rest>", extraer la parte antes del guion
      if (typeof pidRaw === 'string' && pidRaw.includes('-')) {
        pidRaw = pidRaw.split('-')[0];
      }

      const n = Number(pidRaw);
      if (Number.isNaN(n)) {
        throw new BadRequestException(
          `Producto id inválido en invoiceDetails[${idx}]`,
        );
      }
      productIds.push(n);
    });

    const productos = await this.productoRepo.findByIds(productIds);

    const itemsCalculados: IFacturaItemCalculada[] = [];

    for (const item of dto.invoiceDetails) {
      let itemProductIdRaw: any =
        (item as any)?.product?.id ??
        (item as any).productId ??
        (item as any).id;
      if (
        typeof itemProductIdRaw === 'string' &&
        itemProductIdRaw.includes('-')
      ) {
        itemProductIdRaw = itemProductIdRaw.split('-')[0];
      }
      const itemProductId = Number(itemProductIdRaw);
      const producto = productos.find((p) => p.id === itemProductId);

      if (!producto) {
        throw new BadRequestException('Producto no encontrado');
      }
      FacturaValidatorHelper.validarPrecio(producto.price);
      FacturaValidatorHelper.validarStock(
        producto.stock,
        item.quantity,
        producto.name,
      );

      const subtotal = FacturaCalculatorHelper.calcularSubtotal(
        producto.price,
        item.quantity,
      );

      itemsCalculados.push({
        invoiceId: undefined,
        productId: producto.id,
        quantity: item.quantity,
        unitPrice: producto.price,
        subtotal,
      });
    }

    const invoiceNumber = Math.round(Math.random() * 1000);
    const total = FacturaCalculatorHelper.calcularTotal(itemsCalculados);
    const facturaCalculada: IFacturaCalculada = {
      invoiceNumber,
      // conectar con el usuario que obtuvimos por email (o usar userId si viene por dto)
      userId: user && user.id ? user.id : dto.userId,
      customerId: Number(customerId),
      items: itemsCalculados,
      total,
    };

    return await this.repo.create(facturaCalculada);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }

  async changeState(id: number, state: 'PAID' | 'CANCELLED') {
    const factura = await this.repo.findById(id);
    if (!factura) {
      throw new BadRequestException('Factura no encontrada');
    }

    // Solo transiciones desde PENDING
    // Nota: el domain factura puede no exponer `state` en la entidad actual,
    // así que delegamos la verificación final al repositorio que consulta la DB.
    if ((factura as any).state && (factura as any).state !== 'PENDING') {
      throw new BadRequestException(
        'Solo se permiten transiciones desde PENDING',
      );
    }

    if (state !== 'PAID' && state !== 'CANCELLED') {
      throw new BadRequestException('Estado inválido');
    }

    try {
      const updated = await this.repo.updateState(id, state);
      return updated;
    } catch (err) {
      throw new BadRequestException(err.message || 'Error al cambiar estado');
    }
  }
}
