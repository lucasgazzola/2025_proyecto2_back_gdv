import { Test, TestingModule } from '@nestjs/testing';
import { FacturaController } from './factura.controller';
import { FacturaService } from './factura.service';
import { FacturaRepository } from './factura.repository';
import { ProductoRepository } from '../producto/producto.repository';
import { UsuarioRepository } from '../usuario/usuario.repository';

describe('FacturaController', () => {
  let controller: FacturaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturaController],
      providers: [FacturaService, FacturaRepository, ProductoRepository, UsuarioRepository],
    }).compile();

    controller = module.get<FacturaController>(FacturaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
