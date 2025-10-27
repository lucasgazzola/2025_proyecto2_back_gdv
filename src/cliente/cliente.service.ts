import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LogsService } from '../logs/logs.service';
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
    private readonly logsService: LogsService,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const existsEmail = await this.repo.findByEmail(createClienteDto.email);
    if (existsEmail) {
      await this.logsService.createFailureLog(
        'CREATE_CLIENT_FAILED',
        undefined,
        `Email ya en uso: ${createClienteDto.email}`,
      );
      throw new ConflictException('El email ya está en uso');
    }

    const existsDni = await this.repo.findByDni(createClienteDto.dni);

    if (existsDni) {
      await this.logsService.createFailureLog(
        'CREATE_CLIENT_FAILED',
        undefined,
        `DNI ya en uso: ${createClienteDto.dni}`,
      );
      throw new ConflictException('El DNI ya está en uso');
    }

    return await this.repo.create(createClienteDto);
  }

  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    const exists = await this.repo.findById(id);
    if (!exists) {
      await this.logsService.createFailureLog(
        'UPDATE_CLIENT_FAILED',
        undefined,
        `Cliente no encontrado ID: ${id}`,
      );
      throw new NotFoundException('Cliente no encontrado');
    }

    if (updateClienteDto.email) {
      const existsEmail = await this.repo.findByEmail(updateClienteDto.email);
      if (existsEmail && existsEmail.id !== id) {
        await this.logsService.createFailureLog(
          'UPDATE_CLIENT_FAILED',
          undefined,
          `Email ya en uso: ${updateClienteDto.email}`,
        );
        throw new ConflictException('El email ya está en uso');
      }
    }

    if (updateClienteDto.dni) {
      const existsDni = await this.repo.findByDni(updateClienteDto.dni);
      if (existsDni && existsDni.id !== id) {
        await this.logsService.createFailureLog(
          'UPDATE_CLIENT_FAILED',
          undefined,
          `DNI ya en uso: ${updateClienteDto.dni}`,
        );
        throw new ConflictException('El DNI ya está en uso');
      }
    }

    return this.repo.update(id, updateClienteDto);
  }

  async delete(id: number): Promise<Cliente> {
    const exists = await this.repo.findById(id);
    if (!exists || !exists.isActive) {
      await this.logsService.createFailureLog(
        'DELETE_CLIENT_FAILED',
        undefined,
        `Cliente no encontrado ID: ${id}`,
      );
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
