import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Proveedor } from './proveedor.entity';
import { NotFoundException } from '@nestjs/common';
import { LogsService } from '../logs/logs.service';
import { IProveedorRepositoryToken } from './repositories/proveedor.repository.interface';
import type { IProveedorRepository } from './repositories/proveedor.repository.interface';
import { CreateProveedorDto } from './dto/create-proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(
    @Inject(IProveedorRepositoryToken)
    private readonly repo: IProveedorRepository,
    private readonly logsService: LogsService,
  ) {}

  async findAll(): Promise<Proveedor[]> {
    return this.repo.findAll();
  }

  async findById(id: number): Promise<Proveedor | null> {
    const provider = await this.repo.findById(id);
    if (!provider) {
      await this.logsService.createFailureLog(
        'GET_PROVIDER_FAILED',
        undefined,
        `Proveedor no encontrado ID: ${id}`,
      );
      throw new NotFoundException('Proveedor no encontrado');
    }

    return provider;
  }

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    const existingCode = await this.repo.findByCode(createProveedorDto.code);

    if (existingCode) {
      await this.logsService.createFailureLog(
        'CREATE_PROVIDER_FAILED',
        undefined,
        `Código ya existe: ${createProveedorDto.code}`,
      );
      throw new ConflictException('Código de proveedor ya existe');
    }

    const existingEmail = await this.repo.findByEmail(createProveedorDto.email);

    if (existingEmail) {
      await this.logsService.createFailureLog(
        'CREATE_PROVIDER_FAILED',
        undefined,
        `Email ya existe: ${createProveedorDto.email}`,
      );
      throw new ConflictException('Email de proveedor ya existe');
    }

    return this.repo.create(createProveedorDto);
  }

  async update(id: number, updateProveedorDto: any): Promise<Proveedor> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      await this.logsService.createFailureLog(
        'UPDATE_PROVIDER_FAILED',
        undefined,
        `Proveedor no encontrado ID: ${id}`,
      );
      throw new NotFoundException('Proveedor no encontrado');
    }
    const existingEmail = await this.repo.findByEmail(updateProveedorDto.email);
    if (existingEmail && existingEmail.id !== id) {
      await this.logsService.createFailureLog(
        'UPDATE_PROVIDER_FAILED',
        undefined,
        `Email ya existe: ${updateProveedorDto.email}`,
      );
      throw new ConflictException('Email de proveedor ya existe');
    }
    const existingCode = await this.repo.findByCode(updateProveedorDto.code);
    if (existingCode && existingCode.id !== id) {
      await this.logsService.createFailureLog(
        'UPDATE_PROVIDER_FAILED',
        undefined,
        `Código ya existe: ${updateProveedorDto.code}`,
      );
      throw new ConflictException('Código de proveedor ya existe');
    }

    return this.repo.update(id, updateProveedorDto);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      await this.logsService.createFailureLog(
        'DELETE_PROVIDER_FAILED',
        undefined,
        `Proveedor no encontrado ID: ${id}`,
      );
      throw new NotFoundException('Proveedor no encontrado');
    }
    return this.repo.delete(id);
  }
}
