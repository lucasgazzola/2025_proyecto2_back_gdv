import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { CategoriaRepository } from 'src/categoria/categoria.repository';
import { MarcaModule } from 'src/marca/marca.module';
import { CategoriaModule } from 'src/categoria/categoria.module';
import { PrismaProductoRepository } from './repositories/prisma-producto.repository';
import { IProductoRepositoryToken } from './repositories/producto.repository.interface';
import { ProductoValidator } from './producto.validator';
import { AuthModule } from '../auth/auth.module';
import { LogsModule } from '../logs/logs.module';


@Module({
  imports: [MarcaModule, CategoriaModule, AuthModule, LogsModule],
  controllers: [ProductoController],
  providers: [
    ProductoService,
    CategoriaRepository,
    {
      provide: 'IProductoRepository',
      useClass: PrismaProductoRepository,

    },
    ProductoValidator,

  ],
  exports: [ProductoService, IProductoRepositoryToken],
})
export class ProductoModule {}
