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
import { Roles } from '../auth/roles.decorators';
import { Role } from '../common/enums/roles.enums';
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { CreateProveedorDto } from './dto/create-proveedor.dto';

@Controller('proveedores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProveedorController {
  constructor(private readonly service: ProveedorService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  create(@Body() createProveedorDto: CreateProveedorDto) {
    return this.service.create(createProveedorDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.USER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ) {
    return this.service.update(id, updateProveedorDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
