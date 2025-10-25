import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IClienteRepository,
  IClienteRepositoryToken,
} from './repositories/cliente.repository.interface';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { Cliente } from './cliente.entity';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @Inject(IClienteRepositoryToken)
    private readonly repo: IClienteRepository,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    return this.repo.create(createClienteDto);
  }

  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    const exists = await this.repo.findById(id);
    if (!exists) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return this.repo.update(id, updateClienteDto);
  }

  async delete(id: number): Promise<Cliente> {
    const exists = await this.repo.findById(id);
    if (!exists || !exists.isActive) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return this.repo.delete(id);
  }

  async findAll(): Promise<Cliente[]> {
    return this.repo.findAll();
  }

  async findById(id: number): Promise<Cliente | null> {
    return this.repo.findById(id);
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    return this.repo.findByEmail(email);
  }
}
