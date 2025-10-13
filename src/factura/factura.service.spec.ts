import { Test, TestingModule } from '@nestjs/testing';
import { FacturaService } from './factura.service';
import { FacturaRepository } from './factura.repository';
import { ProductoRepository } from '../producto/producto.repository';
import { UsuarioRepository } from '../usuario/usuario.repository';

describe('FacturaService', () => {
  let service: FacturaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacturaService, FacturaRepository, ProductoRepository, UsuarioRepository],
    }).compile();

    service = module.get<FacturaService>(FacturaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
