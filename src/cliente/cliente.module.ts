import { Module } from '@nestjs/common';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { IClienteRepositoryToken } from './repositories/cliente.repository.interface';
import { PrismaClienteRepository } from './repositories/prisma-cliente.repository';
import { LogsModule } from 'src/logs/logs.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ClienteController],
  imports: [AuthModule, LogsModule],
  providers: [
    ClienteService,
    {
      provide: IClienteRepositoryToken,
      useClass: PrismaClienteRepository,
    },
  ],
})
export class ClienteModule {}
