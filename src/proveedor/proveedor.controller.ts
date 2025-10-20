import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ParseIntPipe } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorators';
import { Role } from 'src/common/enums/roles.enums';
import { JwtAuthGuard } from 'src/auth/auth-roles.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('proveedores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProveedorController {
  constructor(private readonly service: ProveedorService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
