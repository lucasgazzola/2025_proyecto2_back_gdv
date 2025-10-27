import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';
import { LogsService } from '../logs/logs.service';
import { JwtAuthGuard } from './auth-roles.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logsService: LogsService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterAuthDto) {
    try {
      await this.logsService.createInfoLog(
        'ATTEMPT_REGISTER',
        undefined,
        `Intento de registro: ${dto.email}`,
      );
    } catch (e) {}
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginAuthDto) {
    try {
      await this.logsService.createInfoLog(
        'ATTEMPT_LOGIN',
        undefined,
        `Intento de login: ${dto.email}`,
      );
    } catch (e) {}
    return this.authService.login(dto);
  }

  @Post('logout')
  logout() {
    try {
      // logout puede no tener user context aquí — dejar registro informativo sin userId
      this.logsService.createInfoLog('LOGOUT', undefined, 'Logout solicitado');
    } catch (e) {}
    return this.authService.logout();
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    try {
      await this.logsService.createInfoLog(
        'REFRESH_TOKEN',
        undefined,
        'Solicitud de refresh token',
      );
    } catch (e) {}
    return this.authService.refreshToken(refreshToken);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    try {
      await this.logsService.createInfoLog(
        'FORGOT_PASSWORD',
        undefined,
        `Solicitud reset para: ${email}`,
      );
    } catch (e) {}
    return this.authService.sendPasswordResetEmail(email);
  }

  @Post('validate-token')
  @UseGuards(JwtAuthGuard)
  async validateToken(@Body('token') token: string, @Request() req) {
    try {
      await this.logsService.createInfoLog(
        'VALIDATE_TOKEN',
        req.user?.id,
        'Validación de token',
      );
    } catch (e) {}
    return this.authService.validateToken(token);
  }
}
