import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Proveedor } from './proveedor.entity';
import { NotFoundException } from '@nestjs/common';
import { IProveedorRepositoryToken } from './repositories/proveedor.repository.interface';
import type { IProveedorRepository } from './repositories/proveedor.repository.interface';
import { CreateProveedorDto } from './dto/create-proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(
    @Inject(IProveedorRepositoryToken)
    private readonly repo: IProveedorRepository,
  ) {}

  async findAll(): Promise<Proveedor[]> {
    return this.repo.findAll();
  }

  async findById(id: number): Promise<Proveedor | null> {
    const provider = this.repo.findById(id);
    if (!provider) throw new NotFoundException('Proveedor no encontrado');

    return provider;
  }

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    const existingCode = await this.repo.findByCode(createProveedorDto.code);

    if (existingCode)
      throw new ConflictException('Código de proveedor ya existe');

    const existingEmail = await this.repo.findByEmail(createProveedorDto.email);

    if (existingEmail)
      throw new ConflictException('Email de proveedor ya existe');

    return this.repo.create(createProveedorDto);
  }

  async update(id: number, updateProveedorDto: any): Promise<Proveedor> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException('Proveedor no encontrado');
    }
    const existingEmail = await this.repo.findByEmail(updateProveedorDto.email);
    if (existingEmail && existingEmail.id !== id) {
      throw new ConflictException('Email de proveedor ya existe');
    }
    const existingCode = await this.repo.findByCode(updateProveedorDto.code);
    if (existingCode && existingCode.id !== id) {
      throw new ConflictException('Código de proveedor ya existe');
    }

    return this.repo.update(id, updateProveedorDto);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException('Proveedor no encontrado');
    }
    return this.repo.delete(id);
  }
}
