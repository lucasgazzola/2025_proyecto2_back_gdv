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
import { CategoriaService } from './categoria.service';
import { ParseIntPipe } from '@nestjs/common';
import { LogsService } from '../logs/logs.service';
import { Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Role } from '../common/enums/roles.enums';
import { Roles } from '../auth/roles.decorators';

@Controller('categorias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriaController {
  constructor(
    private readonly service: CategoriaService,
    private readonly logsService: LogsService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  async findAll(@Request() req) {
    try {
      await this.logsService.createInfoLog(
        'GET_CATEGORIES',
        req.user?.id,
        `Usuario ${req.user?.email} listó categorías`,
      );
    } catch (e) {}
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    try {
      await this.logsService.createInfoLog(
        'GET_CATEGORY',
        req.user?.id,
        `Usuario ${req.user?.email} solicitó categoría ID: ${id}`,
      );
    } catch (e) {}
    return await this.service.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  async create(@Body() createDto: CreateCategoriaDto, @Request() req) {
    const result = await this.service.create(createDto);
    try {
      await this.logsService.createSuccessLog(
        'CREATE_CATEGORY',
        req.user?.id,
        `Usuario ${req.user?.email} creó categoría: ${createDto.name}`,
      );
    } catch (e) {}
    return result;
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.USER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCategoriaDto,
    @Request() req,
  ) {
    const result = await this.service.update(id, updateDto);
    try {
      await this.logsService.createSuccessLog(
        'UPDATE_CATEGORY',
        req.user?.id,
        `Usuario ${req.user?.email} actualizó categoría ID: ${id}`,
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
        'DELETE_CATEGORY',
        req.user?.id,
        `Usuario ${req.user?.email} eliminó categoría ID: ${id}`,
      );
    } catch (e) {}
    return result;
  }
}
