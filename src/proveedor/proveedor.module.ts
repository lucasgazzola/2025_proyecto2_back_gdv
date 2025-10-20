import { Module } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ProveedorController } from './proveedor.controller';
import { PrismaProveedorRepository } from './repositories/prisma-proveedor.repository';
import { IProveedorRepositoryToken } from './repositories/proveedor.repository.interface';
import { AuthService } from 'src/auth/auth.service';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { UsuarioService } from 'src/usuario/usuario.service';
import { MailService } from 'src/common/mail.service';
import { IUsuarioRepositoryToken } from 'src/usuario/repositories/usuario.repository.interface';
import { PrismaUsuarioRepository } from 'src/usuario/repositories/prisma-usuario.repository';

@Module({
  controllers: [ProveedorController],
  providers: [
    ProveedorService, 
    PrismaProveedorRepository,
    { 
      provide: IProveedorRepositoryToken, 
      useClass: PrismaProveedorRepository 
    },
    {
      provide: IUsuarioRepositoryToken,
      useClass: PrismaUsuarioRepository
    },
    AuthService,
    UsuarioService,
    MailService
  ],
  exports: [ProveedorService]
})
export class ProveedorModule {}
