import { Module, forwardRef } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaUsuarioRepository } from './repositories/prisma-usuario.repository';
import { IUsuarioRepositoryToken } from './repositories/usuario.repository.interface';
import { AuthModule } from '../auth/auth.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => LogsModule),
  ],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    {
      provide: IUsuarioRepositoryToken,
      useClass: PrismaUsuarioRepository,
    },
  ],
  exports: [UsuarioService, IUsuarioRepositoryToken],
})
export class UsuarioModule {}
