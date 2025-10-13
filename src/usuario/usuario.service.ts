import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { User } from './usuario.interface';
import { UsuarioRepository } from './usuario.repository';

@Injectable()
export class UsuarioService {
  constructor(private readonly repo: UsuarioRepository) {}

  async create(dto: CreateUsuarioDto): Promise<User> {
    return this.repo.create(dto);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repo.findByEmail(email);
  }

  async findByEmailWithPassword(email: string): Promise<User | undefined> {
    return this.repo.findByEmailWithPassword(email);
  }

  findAll(): User[] {
    return this.repo.findAll();
  }

  findOne(id: number): User {
    return this.repo.findOne(id);
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<User> {
    const data = { ...dto };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.repo.update(id, data);
  }

  remove(id: number): void {
    this.repo.remove(id);
  }
}
