import { Test, TestingModule } from '@nestjs/testing';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { ProductoRepository } from './producto.repository';
import { MarcaRepository } from '../marca/marca.repository';
import { CategoriaRepository } from '../categoria/categoria.repository';

describe('ProductoController', () => {
  let controller: ProductoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoController],
      providers: [ProductoService, ProductoRepository, MarcaRepository, CategoriaRepository],
    }).compile();

    controller = module.get<ProductoController>(ProductoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
