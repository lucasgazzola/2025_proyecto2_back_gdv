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
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Roles } from 'src/auth/roles.decorators';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { LogsService } from 'src/logs/logs.service';
import { Role } from 'src/common/enums/roles.enums';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('cliente')
export class ClienteController {
  // Implementación del controlador de cliente
  constructor(
    private readonly service: ClienteService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  @Get('email/:email')
  @Roles(Role.ADMIN)
  findByEmail(@Param('email') email: string) {
    return this.service.findByEmail(email);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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
