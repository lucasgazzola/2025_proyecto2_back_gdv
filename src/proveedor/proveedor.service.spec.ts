import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';

describe('ProveedorService', () => {
  let service: ProveedorService;
  const mockRepo: any = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByCode: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProveedorService(mockRepo as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('throws NotFoundException when provider does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.findById(123)).rejects.toThrow(NotFoundException);
      await expect(service.findById(123)).rejects.toThrow(
        'Proveedor no encontrado',
      );
    });

    it('returns provider when found', async () => {
      const p = { id: 5, name: 'ACME' };
      mockRepo.findById.mockResolvedValue(p);
      await expect(service.findById(5)).resolves.toEqual(p);
    });
  });

  describe('create', () => {
    it('throws ConflictException when code already exists', async () => {
      mockRepo.findByCode.mockResolvedValue({ id: 1 });
      const dto: any = { code: 'C1', email: 'a@b.com' };
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      await expect(service.create(dto)).rejects.toThrow(
        'Código de proveedor ya existe',
      );
    });

    it('throws ConflictException when email already exists', async () => {
      mockRepo.findByCode.mockResolvedValue(null);
      mockRepo.findByEmail.mockResolvedValue({ id: 2 });
      const dto: any = { code: 'C2', email: 'exist@e.com' };
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      await expect(service.create(dto)).rejects.toThrow(
        'Email de proveedor ya existe',
      );
    });

    it('delegates to repo.create when data ok', async () => {
      mockRepo.findByCode.mockResolvedValue(null);
      mockRepo.findByEmail.mockResolvedValue(null);
      const dto: any = { code: 'NEW', email: 'new@e.com' };
      mockRepo.create.mockResolvedValue({ id: 10, ...dto });
      await expect(service.create(dto)).resolves.toEqual({ id: 10, ...dto });
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('throws NotFoundException when updating non-existent provider', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.update(7, {})).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException when email conflict with other provider', async () => {
      const existing = { id: 7, email: 'old@e.com' };
      mockRepo.findById.mockResolvedValue(existing);
      mockRepo.findByEmail.mockResolvedValue({ id: 8, email: 'new@e.com' });
      await expect(service.update(7, { email: 'new@e.com' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws ConflictException when code conflict with other provider', async () => {
      const existing = { id: 7, code: 'X' };
      mockRepo.findById.mockResolvedValue(existing);
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.findByCode.mockResolvedValue({ id: 9, code: 'Y' });
      await expect(service.update(7, { code: 'Y' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('delegates to repo.update when ok', async () => {
      const existing = { id: 7, email: 'a@b.com', code: 'Z' };
      mockRepo.findById.mockResolvedValue(existing);
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.findByCode.mockResolvedValue(null);
      mockRepo.update.mockResolvedValue({ id: 7, email: 'a@b.com' });
      await expect(service.update(7, { email: 'a@b.com' })).resolves.toEqual({
        id: 7,
        email: 'a@b.com',
      });
      expect(mockRepo.update).toHaveBeenCalledWith(7, { email: 'a@b.com' });
    });
  });

  describe('delete', () => {
    it('throws NotFoundException when deleting non-existent provider', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.delete(5)).rejects.toThrow(NotFoundException);
    });

    it('delegates to repo.delete when exists', async () => {
      mockRepo.findById.mockResolvedValue({ id: 5 });
      mockRepo.delete.mockResolvedValue(undefined);
      await expect(service.delete(5)).resolves.toBeUndefined();
      expect(mockRepo.delete).toHaveBeenCalledWith(5);
    });
  });
});
