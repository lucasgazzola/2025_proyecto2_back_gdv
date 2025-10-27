import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private readonly logsService: LogsService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      // log failure (no user id available)
      this.logsService
        .createFailureLog('AUTH_FAILED', undefined, 'Token no proporcionado')
        .catch(() => {});
      throw new UnauthorizedException('Token no proporcionado');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      this.logsService
        .createFailureLog('AUTH_FAILED', undefined, 'Formato de token inválido')
        .catch(() => {});
      throw new UnauthorizedException('Formato de token inválido');
    }

    try {
      const payload = this.authService.getPayload(token, 'auth');
      request.user = payload;
      return true;
    } catch (error) {
      this.logsService
        .createFailureLog('AUTH_FAILED', undefined, 'Token inválido o expirado')
        .catch(() => {});
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
