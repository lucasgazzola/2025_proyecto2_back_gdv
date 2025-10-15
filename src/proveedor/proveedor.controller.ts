import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { Proveedor } from './proveedor.entity';
import { ParseIntPipe } from '@nestjs/common';

@Controller('proveedores')
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
