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
    const existing = await this.repo.findByCode(createProveedorDto.code);
    if (existing) throw new ConflictException('Proveedor ya existe');

    return this.repo.create(createProveedorDto);
  }

  async update(id: number, updateProveedorDto: any): Promise<Proveedor> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException('Proveedor no encontrado');
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
