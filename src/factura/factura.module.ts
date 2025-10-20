import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { IFacturaRepositoryToken } from './repositories/factura.repository.interface';
import { PrismaFacturaRepository } from './repositories/prisma-factura.repository';
import { ProductoModule } from 'src/producto/producto.module';
import { AuthModule } from '../auth/auth.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [ProductoModule, AuthModule, LogsModule],
  controllers: [FacturaController],
  providers: [
    FacturaService,
    {
      provide: IFacturaRepositoryToken,
      useClass: PrismaFacturaRepository,
    },
  
  ],
  exports: [FacturaService, IFacturaRepositoryToken],
})
export class FacturaModule {}
