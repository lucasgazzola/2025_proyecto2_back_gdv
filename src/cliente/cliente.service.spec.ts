import { ClienteService } from './cliente.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';

describe('ClienteService - gestión de clientes', () => {
  let service: ClienteService;
  const mockRepo: any = {
    findByEmail: jest.fn(),
    findByDni: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ClienteService(mockRepo);
  });

  it('When (1) firstName, lastName or dni empty -> DTO validation messages', async () => {
    const CreateDto = require('./dto/create-cliente.dto').CreateClienteDto;
    const dto = new CreateDto();
    dto.firstName = '';
    dto.lastName = '';
    dto.email = 'bad@example.com';
    dto.dni = '';

    const errors = await validate(dto as any);
    const messages = errors.flatMap((e: any) =>
      e.constraints ? Object.values(e.constraints) : [],
    );
    expect(messages).toContain('El nombre es obligatorio');
    expect(messages).toContain('El apellido es obligatorio');
    expect(messages).toContain('El DNI es obligatorio');
  });

  it('When (2) invalid or duplicate email -> service throws "Correo electrónico inválido o duplicado"', async () => {
    const CreateDto = require('./dto/create-cliente.dto').CreateClienteDto;
    const dto = new CreateDto();
    dto.firstName = 'A';
    dto.lastName = 'B';
    dto.email = 'bademail';
    dto.dni = '123';

    // invalid format
    let errors = await validate(dto as any);
    let messages = errors.flatMap((e: any) =>
      e.constraints ? Object.values(e.constraints) : [],
    );
    expect(messages).toContain('Correo electrónico inválido');

    // duplicate
    dto.email = 'dup@example.com';
    mockRepo.findByEmail.mockResolvedValue({ id: 2, email: dto.email });
    await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
    await expect(service.create(dto as any)).rejects.toThrow(
      'El email ya está en uso',
    );
  });

  it('When (3) valid data -> creates client successfully', async () => {
    const CreateDto = require('./dto/create-cliente.dto').CreateClienteDto;
    const dto = new CreateDto();
    dto.firstName = 'Nombre';
    dto.lastName = 'Apellido';
    dto.email = 'ok@example.com';
    dto.dni = 'dni123';

    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.findByDni.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue({ id: 10, email: dto.email });

    const res = await service.create(dto as any);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(res).toHaveProperty('email', dto.email);
  });
});
