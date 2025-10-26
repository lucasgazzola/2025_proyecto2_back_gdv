import { UsuarioService } from './usuario.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Role } from '../common/enums/roles.enums';

describe('UsuarioService - roles management (unit)', () => {
  let service: UsuarioService;
  const mockRepo: any = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByEmailWithPassword: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updatePassword: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsuarioService(mockRepo);
  });

  it('When (1) modifying role of non-existent user -> throws "Usuario no encontrado"', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.update(123, { role: Role.ADMIN } as any)).rejects.toThrow(NotFoundException);
    await expect(service.update(123, { role: Role.ADMIN } as any)).rejects.toThrow('Usuario no encontrado');
  });

  it('When (2) admin selects invalid role -> throws "Rol no válido"', async () => {
    // Simulate existing user
    mockRepo.findById.mockResolvedValue({ id: 5, email: 'a@b.com' });
    await expect(service.update(5, { role: 'INVALID_ROLE' } as any)).rejects.toThrow(BadRequestException);
    await expect(service.update(5, { role: 'INVALID_ROLE' } as any)).rejects.toThrow('Rol no válido');
  });

  it('When (3) assign valid role -> saves and returns updated user with new role', async () => {
    const existing = { id: 7, email: 'user@example.com', role: Role.USER };
    mockRepo.findById.mockResolvedValue(existing);
    const updated = { ...existing, role: Role.ADMIN };
    mockRepo.update.mockResolvedValue(updated);

    const result = await service.update(existing.id, { role: Role.ADMIN } as any);
    expect(mockRepo.update).toHaveBeenCalledWith(existing.id, expect.objectContaining({ role: Role.ADMIN }));
    expect(result).toEqual(updated);
  });
});
