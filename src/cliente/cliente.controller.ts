import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Roles } from '../auth/roles.decorators';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { LogsService } from '../logs/logs.service';
import { Role } from '../common/enums/roles.enums';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('clientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClienteController {
  // Implementación del controlador de cliente
  constructor(
    private readonly service: ClienteService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  async create(@Body() createClienteDto: CreateClienteDto, @Request() req) {
    const result = await this.service.create(createClienteDto);
    await this.logsService.createSuccessLog(
      'CREATE_CLIENTE',
      req.user.id,
      `Usuario ${req.user.email} creó nuevo cliente: ${createClienteDto.email}`,
    );
    return result;
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  async findAll(@Request() req) {
    try {
      await this.logsService.createInfoLog(
        'GET_CLIENTES',
        req.user?.id,
        `Usuario ${req.user?.email} listó clientes`,
      );
    } catch (e) {}
    return this.service.findAll();
  }

  @Get(':email')
  @Roles(Role.ADMIN, Role.USER)
  async findByEmail(@Param('email') email: string, @Request() req) {
    try {
      await this.logsService.createInfoLog(
        'GET_CLIENT_BY_EMAIL',
        req.user?.id,
        `Usuario ${req.user?.email} solicitó cliente por email: ${email}`,
      );
    } catch (e) {}
    return this.service.findByEmail(email);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  async findById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    try {
      await this.logsService.createInfoLog(
        'GET_CLIENT',
        req.user?.id,
        `Usuario ${req.user?.email} solicitó cliente ID: ${id}`,
      );
    } catch (e) {}
    return this.service.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
    @Request() req,
  ) {
    const result = await this.service.update(id, updateClienteDto);
    await this.logsService.createSuccessLog(
      'UPDATE_CLIENTE',
      req.user.id,
      `Usuario ${req.user.email} actualizó cliente ID: ${id}`,
    );
    return result;
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.service.delete(id);
    await this.logsService.createSuccessLog(
      'DELETE_CLIENTE',
      req.user.id,
      `Usuario ${req.user.email} eliminó cliente ID: ${id}`,
    );
    return result;
  }
}
