import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IFacturaRepositoryToken } from './repositories/factura.repository.interface';
import type { IFacturaRepository } from './repositories/factura.repository.interface';
import { CreateFacturaDto} from './dto/create-factura.dto';
import { FacturaValidatorHelper } from './helpers/factura-validator.helper';
import { IFacturaItemCalculada } from './factura-calculada.interface';
import { IProductoRepositoryToken } from 'src/producto/repositories/producto.repository.interface';
import type { IProductoRepository } from 'src/producto/repositories/producto.repository.interface';
import { FacturaCalculatorHelper } from './helpers/factura-calculator.helper';
import { IFacturaCalculada } from './factura-calculada.interface';

@Injectable()
export class FacturaService {
  constructor(
    @Inject(IFacturaRepositoryToken)
    private readonly repo: IFacturaRepository,
    @Inject(IProductoRepositoryToken)
    private readonly productoRepo: IProductoRepository
  ) {}

  findAll() {
    return this.repo.findAll();
  }

  findById(id: number) {
    return this.repo.findById(id);
  }

  async create(dto: CreateFacturaDto) {

    FacturaValidatorHelper.validarItems(dto.items);

    for (const item of dto.items) {
      FacturaValidatorHelper.validarCantidad(item.quantity);
    }
    
    const productos = await this.productoRepo.findByIds(dto.items.map(i => i.productId));

    const itemsCalculados: IFacturaItemCalculada[] = []

    for (const item of dto.items) {
      const producto = productos.find(p => p.id === item.productId);

      if (!producto) {
          throw new BadRequestException('Producto no encontrado');
      }
      FacturaValidatorHelper.validarPrecio(producto.price);
      FacturaValidatorHelper.validarStock(producto.stock, item.quantity, producto.name);

      const subtotal = FacturaCalculatorHelper.calcularSubtotal(producto.price, item.quantity);
      
      itemsCalculados.push({
        invoiceId: undefined,
        productId: producto.id,
        quantity: item.quantity,
        providerId: producto.providerId,
        unitPrice: producto.price,
        subtotal
      });
    }

    const invoiceNumber = Math.round(Math.random() * 1000);
    const total = FacturaCalculatorHelper.calcularTotal(itemsCalculados);
    const facturaCalculada: IFacturaCalculada = { invoiceNumber, userId: dto.userId, items: itemsCalculados, total };

    return await this.repo.create(facturaCalculada);

  }



  delete(id: number) {
    return this.repo.delete(id);
  }
}
