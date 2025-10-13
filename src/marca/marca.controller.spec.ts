import { Test, TestingModule } from '@nestjs/testing';
import { MarcaController } from './marca.controller';
import { MarcaService } from './marca.service';
import { MarcaRepository } from './marca.repository';
import { ProductoRepository } from '../producto/producto.repository';

describe('MarcaController', () => {
  let controller: MarcaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarcaController],
      providers: [MarcaService, MarcaRepository, ProductoRepository],
    }).compile();

    controller = module.get<MarcaController>(MarcaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
