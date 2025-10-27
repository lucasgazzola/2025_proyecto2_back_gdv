import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { LogsService } from '../logs/logs.service';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/enums/roles.enums';
import { ROLES_KEY } from './roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly logsService: LogsService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logsService
        .createFailureLog('AUTH_FAILED', undefined, 'Usuario no autenticado')
        .catch(() => {});
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const tieneRol = requiredRoles.includes(user.role);

    if (!tieneRol) {
      this.logsService
        .createFailureLog(
          'AUTH_FORBIDDEN',
          user?.id,
          `Acceso denegado para usuario ${user?.email}`,
        )
        .catch(() => {});
      throw new ForbiddenException(
        'No tienes permiso para acceder a este recurso',
      );
    }

    return true;
  }
}
