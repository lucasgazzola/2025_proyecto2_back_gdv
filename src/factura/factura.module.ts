import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { FacturaRepository } from './factura.repository';
import { ProductoRepository } from '../producto/producto.repository';
import { UsuarioRepository } from '../usuario/usuario.repository';

@Module({
  controllers: [FacturaController],
  providers: [FacturaService, FacturaRepository, ProductoRepository, UsuarioRepository],
})
export class FacturaModule {}
