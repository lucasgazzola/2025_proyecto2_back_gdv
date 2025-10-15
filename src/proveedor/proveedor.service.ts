import { Inject, Injectable } from '@nestjs/common';
import { Proveedor } from './proveedor.entity';
import { NotFoundException } from '@nestjs/common';
import { IProveedorRepositoryToken } from './repositories/proveedor.repository.interface';
import type { IProveedorRepository } from './repositories/proveedor.repository.interface';

@Injectable()
export class ProveedorService {
  constructor( 
  @Inject(IProveedorRepositoryToken) 
  private readonly repo: IProveedorRepository) {}

  async findAll(): Promise<Proveedor[]> {
    return this.repo.findAll();
  }

  async findById(id: number): Promise<Proveedor | null> {

    const provider = this.repo.findById(id);
    if (!provider) throw new NotFoundException('Proveedor no encontrado');
    
    return provider;
  }
}
