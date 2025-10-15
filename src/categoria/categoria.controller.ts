import { Controller, Get, Param } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { ParseIntPipe } from '@nestjs/common';

@Controller('categorias')
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
