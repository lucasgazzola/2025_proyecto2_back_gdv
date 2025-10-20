import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { JwtAuthGuard } from '../auth/auth-roles.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorators';
import { Role } from '../common/enums/roles.enums';
import { LogsService } from '../logs/logs.service';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly logsService: LogsService,
  ) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.usuarioService.findById(req.user.id);
  }

  @Post()
  @Roles(Role.AUDITOR)
  async create(@Body() createUsuarioDto: CreateUsuarioDto, @Request() req) {
    const result = await this.usuarioService.create(createUsuarioDto);
    await this.logsService.createSuccessLog(
      'CREATE_USER',
      req.user.id,
      `Usuario ${req.user.email} creó nuevo usuario: ${createUsuarioDto.email}`,
    );
    return result;
  }

  @Get()
  @Roles(Role.AUDITOR)
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get('email/:email')
  @Roles(Role.AUDITOR)
  findByEmail(@Param('email') email: string) {
    return this.usuarioService.findByEmail(email);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.findById(id);
  }
  
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUsuarioDto: UpdateUsuarioDto, @Request() req) {
    const result = await this.usuarioService.update(id, updateUsuarioDto);
    await this.logsService.createSuccessLog(
      'UPDATE_USER',
      req.user.id,
      `Usuario ${req.user.email} actualizó usuario ID: ${id}`,
    );
    return result;
  }

  @Delete(':id')
  @Roles(Role.AUDITOR)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.usuarioService.remove(id);
    await this.logsService.createSuccessLog(
      'DELETE_USER',
      req.user.id,
      `Usuario ${req.user.email} eliminó usuario ID: ${id}`,
    );
    return result;
  }
}
