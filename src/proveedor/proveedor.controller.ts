import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ParseIntPipe } from '@nestjs/common';
import { LogsService } from '../logs/logs.service';
import { Request } from '@nestjs/common';
import { Roles } from '../auth/roles.decorators';
import { Role } from '../common/enums/roles.enums';
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { CreateProveedorDto } from './dto/create-proveedor.dto';

@Controller('proveedores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProveedorController {
  constructor(
    private readonly service: ProveedorService,
    private readonly logsService: LogsService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  async findAll(@Request() req) {
    try {
      await this.logsService.createInfoLog(
        'GET_PROVIDERS',
        req.user?.id,
        `Usuario ${req.user?.email} listó proveedores`,
      );
    } catch (e) {}
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    try {
      await this.logsService.createInfoLog(
        'GET_PROVIDER',
        req.user?.id,
        `Usuario ${req.user?.email} solicitó proveedor ID: ${id}`,
      );
    } catch (e) {}
    return this.service.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  async create(@Body() createProveedorDto: CreateProveedorDto, @Request() req) {
    const result = await this.service.create(createProveedorDto);
    try {
      await this.logsService.createSuccessLog(
        'CREATE_PROVIDER',
        req.user?.id,
        `Usuario ${req.user?.email} creó proveedor: ${createProveedorDto.name}`,
      );
    } catch (e) {}
    return result;
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.USER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProveedorDto: UpdateProveedorDto,
    @Request() req,
  ) {
    const result = await this.service.update(id, updateProveedorDto);
    try {
      await this.logsService.createSuccessLog(
        'UPDATE_PROVIDER',
        req.user?.id,
        `Usuario ${req.user?.email} actualizó proveedor ID: ${id}`,
      );
    } catch (e) {}
    return result;
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.service.delete(id);
    try {
      await this.logsService.createSuccessLog(
        'DELETE_PROVIDER',
        req.user?.id,
        `Usuario ${req.user?.email} eliminó proveedor ID: ${id}`,
      );
    } catch (e) {}
    return result;
  }
}
