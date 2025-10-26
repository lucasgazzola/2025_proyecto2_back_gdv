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

  it('When (4) update for non-existent id -> throws NotFoundException', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(
      service.update(99, { email: 'x@y.com' } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('When (5) update email conflict -> throws ConflictException', async () => {
    const existing = { id: 7, email: 'old@example.com', dni: 'd1' };
    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.findByEmail.mockResolvedValue({
      id: 8,
      email: 'conflict@example.com',
    });

    await expect(
      service.update(7, { email: 'conflict@example.com' } as any),
    ).rejects.toThrow('El email ya está en uso');
  });

  it('When (6) update dni conflict -> throws ConflictException', async () => {
    const existing = { id: 11, email: 'e@e.com', dni: 'd11' };
    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.findByDni.mockResolvedValue({ id: 12, dni: 'other' });

    await expect(service.update(11, { dni: 'other' } as any)).rejects.toThrow(
      'El DNI ya está en uso',
    );
  });

  it('When (7) delete non-existent or inactive -> throws NotFoundException', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.delete(100)).rejects.toThrow(NotFoundException);

    mockRepo.findById.mockResolvedValue({ id: 101, isActive: false });
    await expect(service.delete(101)).rejects.toThrow(NotFoundException);
  });

  it('When (8) delete active client -> calls repo.delete and returns client', async () => {
    mockRepo.findById.mockResolvedValue({ id: 20, isActive: true });
    mockRepo.delete.mockResolvedValue({ id: 20, isActive: true });

    const res = await service.delete(20);
    expect(mockRepo.delete).toHaveBeenCalledWith(20);
    expect(res).toHaveProperty('id', 20);
  });
});
