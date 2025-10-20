import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';
import { Role } from '../common/enums/roles.enums';
import { LogsService } from '../logs/logs.service';

@Controller('facturas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FacturaController {
  constructor(
    private readonly service: FacturaService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  async create(@Body() data: any, @Request() req) {
    const result = await this.service.create(data);
    await this.logsService.createSuccessLog(
      'CREATE_INVOICE',
      req.user.id,
      `Usuario ${req.user.email} creó factura ID: ${result.id}`,
    );
    return result;
  }

  @Delete(':id')
  @Roles(Role.AUDITOR)
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.service.delete(id);
    await this.logsService.createSuccessLog(
      'DELETE_INVOICE',
      req.user.id,
      `Usuario ${req.user.email} eliminó factura ID: ${id}`,
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
}
