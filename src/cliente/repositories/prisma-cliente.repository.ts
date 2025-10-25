import { Injectable } from '@nestjs/common';
import { IClienteRepository } from './cliente.repository.interface';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { ClienteMapper } from '../mapper/prisma-cliente.mapper';
import { Cliente } from '../cliente.entity';
import { prisma } from '../../common/config/db-client';

@Injectable()
export class PrismaClienteRepository implements IClienteRepository {
  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const cliente = await prisma.customer.create({
      data: ClienteMapper.toCreatePersistence(createClienteDto),
    });

    return ClienteMapper.toDomain(cliente);
  }

  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    const cliente = await prisma.customer.update({
      where: { id },
      data: ClienteMapper.toUpdatePersistence(updateClienteDto),
    });

    return ClienteMapper.toDomain(cliente);
  }

  async delete(id: number): Promise<Cliente> {
    const cliente = await prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });

    return ClienteMapper.toDomain(cliente);
  }

  async findAll(): Promise<Cliente[]> {
    const clientes = await prisma.customer.findMany({
      where: { isActive: true },
    });

    return clientes.map(ClienteMapper.toDomain);
  }

  async findById(id: number): Promise<Cliente | null> {
    const cliente = await prisma.customer.findUnique({
      where: { id, isActive: true },
    });

    return cliente ? ClienteMapper.toDomain(cliente) : null;
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    const cliente = await prisma.customer.findUnique({
      where: { email, isActive: true },
    });

    return cliente ? ClienteMapper.toDomain(cliente) : null;
  }
}
