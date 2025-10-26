import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { User } from './usuario.entity';
import { IUsuarioRepositoryToken } from './repositories/usuario.repository.interface';
import type { IUsuarioRepository } from './repositories/usuario.repository.interface';
import { Role } from '../common/enums/roles.enums';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(IUsuarioRepositoryToken)
    private readonly repo: IUsuarioRepository,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<User> {
    return this.repo.create(dto);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repo.findByEmail(email);
  }

  async findByEmailWithPassword(email: string): Promise<User | undefined> {
    return this.repo.findByEmailWithPassword(email);
  }

  async findAll(): Promise<User[]> {
    return this.repo.findAll();
  }

  async findById(id: number): Promise<User> {
    return this.repo.findById(id);
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<User> {
    // Ensure user exists
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validate role if provided
    if ((dto as any).role !== undefined) {
      const roleValue = (dto as any).role;
      if (!Object.values(Role).includes(roleValue)) {
        throw new BadRequestException('Rol no válido');
      }
    }

    const data = { ...dto };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.repo.update(id, data);
  }

  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ) {
    // Necesitamos el password hasheado para comparar, por eso usamos findByEmailWithPassword
    const userWithPassword: any =
      await this.repo.findByEmailWithPassword(email);
    if (!userWithPassword) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const passwordMatch = await bcrypt.compare(
      oldPassword,
      userWithPassword.password,
    );
    if (!passwordMatch) {
      throw new BadRequestException('Contraseña actual incorrecta');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // userWithPassword.id normalmente es number (id de Prisma)
    await this.repo.updatePassword(userWithPassword.id, hashedNewPassword);

    return { success: true, message: 'Contraseña cambiada correctamente' };
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
