import { Prisma, PrismaClient } from '@prisma/client';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { Cliente } from 'src/cliente/cliente.entity';

export class ClienteMapper {
  static toDomain(cliente: any): Cliente {
    return {
      id: cliente.id,
      firstName: cliente.firstName,
      lastName: cliente.lastName,
      email: cliente.email,
      dni: cliente.dni,
      phone: cliente.phone,
      address: cliente.address,
      city: cliente.city,
      isActive: cliente.isActive,
      createdAt: cliente.createdAt,
      updatedAt: cliente.updatedAt,
    };
  }

  static toPersistence(cliente: Cliente): any {
    return {
      id: cliente.id,
      firstName: cliente.firstName,
      lastName: cliente.lastName,
      email: cliente.email,
      dni: cliente.dni,
      phone: cliente.phone,
      address: cliente.address,
      city: cliente.city,
      createdAt: cliente.createdAt,
      updatedAt: cliente.updatedAt,
    };
  }

  static toCreatePersistence(
    cliente: CreateClienteDto,
  ): Omit<Cliente, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> {
    return {
      firstName: cliente.firstName,
      lastName: cliente.lastName,
      email: cliente.email,
      dni: cliente.dni,
      phone: cliente.phone,
      address: cliente.address,
      city: cliente.city,
    };
  }

  static toUpdatePersistence(cliente: UpdateClienteDto): Cliente {
    return {
      firstName: cliente.firstName,
      lastName: cliente.lastName,
      email: cliente.email,
      dni: cliente.dni,
      phone: cliente.phone,
      address: cliente.address,
      city: cliente.city,
    } as Cliente;
  }
}
