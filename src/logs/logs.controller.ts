import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';
import { Role } from '../common/enums/roles.enums';

@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  // ? Es necesario permitir la creación de logs vía API?
  // @Post()
  // create(@Body() createLogDto: CreateLogDto) {
  //   return this.logsService.create(createLogDto);
  // }

  @Get()
  @Roles(Role.AUDITOR)
  async findAll(@Request() req) {
    try {
      await this.logsService.createInfoLog(
        'GET_LOGS',
        req.user?.id,
        `Usuario ${req.user?.email} solicitó listado de logs`,
      );
    } catch (e) {}
    return this.logsService.findAll();
  }
}
