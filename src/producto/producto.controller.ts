import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';
import { Role } from '../common/enums/roles.enums';
import { LogsService } from '../logs/logs.service';

@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductoController {
  constructor(
    private readonly productoService: ProductoService,
    private readonly logsService: LogsService,
  ) {}

  @Post()
  @Roles(Role.AUDITOR)
  async create(@Body() createProductoDto: CreateProductoDto, @Request() req) {
    const result = await this.productoService.create(createProductoDto);
    await this.logsService.createSuccessLog(
      'CREATE_PRODUCT',
      req.user.id,
      `Usuario ${req.user.email} creó producto: ${createProductoDto.name}`,
    );
    return result;
  }

  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.AUDITOR)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductoDto: UpdateProductoDto, @Request() req) {
    const result = await this.productoService.update(id, updateProductoDto);
    await this.logsService.createSuccessLog(
      'UPDATE_PRODUCT',
      req.user.id,
      `Usuario ${req.user.email} actualizó producto ID: ${id}`,
    );
    return result;
  }

  @Delete(':id')
  @Roles(Role.AUDITOR)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.productoService.delete(id);
    await this.logsService.createSuccessLog(
      'DELETE_PRODUCT',
      req.user.id,
      `Usuario ${req.user.email} eliminó producto ID: ${id}`,
    );
    return result;
  }
}
