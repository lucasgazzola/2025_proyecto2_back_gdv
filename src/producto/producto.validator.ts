import { Inject, Injectable } from '@nestjs/common';
import type { IProductoRepository } from './repositories/producto.repository.interface';
import { IProductoRepositoryToken } from './repositories/producto.repository.interface';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class ProductoValidator {
  constructor(
    @Inject(IProductoRepositoryToken)
    private readonly repo: IProductoRepository,
    private readonly logsService: LogsService,
  ) {}

  async validarExistencia(id: number): Promise<void> {
    const producto = await this.repo.findById(id);
    if (!producto) {
      await this.logsService.createFailureLog(
        'VALIDATE_PRODUCT_FAILED',
        undefined,
        `Producto no encontrado ID: ${id}`,
      );
      throw new Error(`El producto con el id ${id} no existe.`);
    }
  }
}
