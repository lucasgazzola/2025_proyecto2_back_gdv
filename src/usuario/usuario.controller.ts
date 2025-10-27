import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ChangePasswordDto } from './dto/changePassword-usuario.dto';
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get('email/:email')
  @Roles(Role.ADMIN)
  findByEmail(@Param('email') email: string) {
    return this.usuarioService.findByEmail(email);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.findById(id);
  }

  @Patch('profile')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateProfile(
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Request() req,
  ) {
    const result = await this.usuarioService.update(
      req.user.id,
      updateUsuarioDto,
    );
    await this.logsService.createSuccessLog(
      'UPDATE_PROFILE',
      req.user.id,
      `Usuario ${req.user.email} actualizó su perfil`,
    );
    return result;
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Request() req,
  ) {
    const result = await this.usuarioService.update(id, updateUsuarioDto);
    await this.logsService.createSuccessLog(
      'UPDATE_USER',
      req.user.id,
      `Usuario ${req.user.email} actualizó usuario ID: ${id}`,
    );
    return result;
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const result = await this.usuarioService.remove(id);
    await this.logsService.createSuccessLog(
      'DELETE_USER',
      req.user.id,
      `Usuario ${req.user.email} eliminó usuario ID: ${id}`,
    );
    return result;
  }

  @Patch(':email/change-password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async changePassword(
    @Param('email') email: string,
    @Body() dto: ChangePasswordDto,
    @Request() req,
  ) {
    // req.user.email debe ser string
    if (String(req.user.email) !== email) {
      throw new BadRequestException(
        'No autorizado para cambiar esta contraseña',
      );
    }

    // dto ya validado: dto.old_password, dto.new_password, dto.password_confirm
    if (dto.new_password !== dto.password_confirm) {
      throw new BadRequestException('Las contraseñas nuevas no coinciden');
    }

    const result = await this.usuarioService.changePassword(
      email,
      dto.old_password,
      dto.new_password,
    );

    // registrar log de éxito
    await this.logsService.createSuccessLog(
      'CHANGE_PASSWORD',
      req.user.id,
      `Usuario ${req.user.email} cambió su contraseña`,
    );
    return result;
  }
}
