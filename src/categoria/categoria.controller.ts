import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { NotFoundException } from '@nestjs/common';

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    const categoria = this.service.findById(+id);
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    return categoria;
  }
}
