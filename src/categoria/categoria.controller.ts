import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('categorias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findById(id);

  }
}
