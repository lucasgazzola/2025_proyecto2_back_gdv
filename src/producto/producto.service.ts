import { Injectable, Inject } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { IProductoRepositoryToken } from './repositories/producto.repository.interface';
import type { IProductoRepository } from './repositories/producto.repository.interface';
import { ProductoValidator } from './producto.validator';


@Injectable()
export class ProductoService {
  constructor(
    @Inject(IProductoRepositoryToken) 
    private readonly productoRepo: IProductoRepository,
    private readonly productoValidator: ProductoValidator,
  ) {}

  create(dto: CreateProductoDto) {
    return this.productoRepo.create(dto);
  }

  findAll() {
    return this.productoRepo.findAll();
  }

  findById(id: number) {
    return this.productoRepo.findById(id);
  }

  async update(id: number, dto: UpdateProductoDto) {

    await this.productoValidator.validarExistencia(id);

    return this.productoRepo.update(id, dto);

  }

  async delete(id: number) {

    await this.productoValidator.validarExistencia(id);

    return this.productoRepo.delete(id);
  }
}