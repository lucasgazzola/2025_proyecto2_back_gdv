import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { User } from './usuario.entity';
import { IUsuarioRepositoryToken } from './repositories/usuario.repository.interface';
import type { IUsuarioRepository } from './repositories/usuario.repository.interface';


@Injectable()
export class UsuarioService {
  constructor(
    @Inject(IUsuarioRepositoryToken)
    private readonly repo: IUsuarioRepository) {}

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
    const data = { ...dto };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.repo.update(id, data);
  }

  async remove(id: number): Promise<void> {
    this.repo.delete(id);
  }
}
