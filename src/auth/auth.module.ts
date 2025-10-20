import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { JwtAuthGuard } from './auth-roles.guard';
import { RolesGuard } from './roles.guard';
import { MailService } from 'src/common/mail.service';
import { LogsModule } from 'src/logs/logs.module';

@Module({
  imports: [
    forwardRef(() => UsuarioModule),
    forwardRef(() => LogsModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard, MailService],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
