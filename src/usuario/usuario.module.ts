import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaUsuarioRepository } from './repositories/prisma-usuario.repository';
import { IUsuarioRepositoryToken } from './repositories/usuario.repository.interface';

@Module({
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
