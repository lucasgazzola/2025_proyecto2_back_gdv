import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';
import { Role } from '../common/enums/roles.enums';
import { LogsService } from '../logs/logs.service';

@Controller('marcas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarcaController {
  constructor(
    private readonly service: MarcaService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @Roles(Role.AUDITOR)
  async create(@Body() dto: CreateMarcaDto, @Request() req) {
    const result = await this.service.create(dto);
    await this.logsService.createSuccessLog(
      'CREATE_BRAND',
      req.user.id,
      `Usuario ${req.user.email} creó marca: ${dto.name}`,
    );
    return result;
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Get(':name')
  findByName(@Param('name') name: string) {
    return this.service.findByName(name);
  }

  @Patch(':id')
  @Roles(Role.AUDITOR)
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMarcaDto, @Request() req) {
    const result = await this.service.update(id, dto);
    await this.logsService.createSuccessLog(
      'UPDATE_BRAND',
      req.user.id,
      `Usuario ${req.user.email} actualizó marca ID: ${id}`,
    );
    return result;
  }

  @Delete(':id')
  @Roles(Role.AUDITOR)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.service.remove(id);
    await this.logsService.createSuccessLog(
      'DELETE_BRAND',
      req.user.id,
      `Usuario ${req.user.email} eliminó marca ID: ${id}`,
    );
    return result;
  }
}
