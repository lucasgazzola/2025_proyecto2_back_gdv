import { Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { IMarcaRepositoryToken } from './repositories/marca.repository.interface';
import { PrismaMarcaRepository } from './repositories/prisma-marca.repository';
import { AuthModule } from '../auth/auth.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [AuthModule, LogsModule],
  controllers: [MarcaController],
  providers: [
    MarcaService, 
    {
      provide: IMarcaRepositoryToken,
      useClass: PrismaMarcaRepository
    }, 
  ],
  exports: [MarcaService, IMarcaRepositoryToken],
})
export class MarcaModule {}
