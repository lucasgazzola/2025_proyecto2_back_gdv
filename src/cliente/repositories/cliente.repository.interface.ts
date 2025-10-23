import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { Cliente } from '../cliente.entity';

export const IClienteRepositoryToken = 'IClienteRepository';

export interface IClienteRepository {
  create(createClienteDto: CreateClienteDto): Promise<Cliente>;
  update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente>;
  delete(id: number): Promise<Cliente>;
  findAll(): Promise<Cliente[]>;
  findById(id: number): Promise<Cliente | null>;
  findByEmail(email: string): Promise<Cliente | null>;
}
