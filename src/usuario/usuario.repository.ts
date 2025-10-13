import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { User } from './usuario.interface';

@Injectable()
export class UsuarioRepository {
  private users: User[] = [];
  private id = 1;

  async create(data: CreateUsuarioDto): Promise<User> {
    const newUser: User = {
      id: this.id++,
      ...data,
    };
    this.users.push(newUser);
    return newUser;
  }

  findById(id: number): User | null {
  return this.users.find(u => u.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async findByEmailWithPassword(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email); // Simula incluir password
  }

  findAll(): User[] {
    return [...this.users];
  }

  findOne(id: number): User {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = this.findOne(id);
    Object.assign(user, data);
    return user;
  }

  remove(id: number): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new NotFoundException(`User ${id} not found`);
    this.users.splice(index, 1);
  }
}