import { Module } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ProveedorController } from './proveedor.controller';
import { PrismaProveedorRepository } from './repositories/prisma-proveedor.repository';
import { IProveedorRepositoryToken } from './repositories/proveedor.repository.interface';

@Module({
  controllers: [ProveedorController],
  providers: [
    ProveedorService, 
    PrismaProveedorRepository,
    { 
      provide: IProveedorRepositoryToken, 
      useClass: PrismaProveedorRepository 
    }
  ],
  exports: [ProveedorService]
})
export class ProveedorModule {}
