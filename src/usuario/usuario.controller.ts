import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usuarioService.findByEmail(email);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.findById(id);
  }
  
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.remove(id);
  }
}
