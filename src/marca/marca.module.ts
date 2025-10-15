import { Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { ProductoRepository } from '../producto/producto.repository';
import { IMarcaRepositoryToken } from './repositories/marca.repository.interface';
import { PrismaMarcaRepository } from './repositories/prisma-marca.repository';

@Module({
  controllers: [MarcaController],
  providers: [
    MarcaService, 
    ProductoRepository,
    {
      provide: IMarcaRepositoryToken,
      useClass: PrismaMarcaRepository
    }, 
  ],
  exports: [MarcaService, IMarcaRepositoryToken],
})
export class MarcaModule {}
