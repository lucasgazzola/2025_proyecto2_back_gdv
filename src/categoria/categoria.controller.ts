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
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Role } from 'src/common/enums/roles.enums';
import { Roles } from 'src/auth/roles.decorators';

@Controller('categorias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriaController {
  constructor(private readonly service: CategoriaService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  async create(@Body() createDto: CreateCategoriaDto) {
    return await this.service.create(createDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.USER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCategoriaDto,
  ) {
    return await this.service.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.delete(id);
  }
}
