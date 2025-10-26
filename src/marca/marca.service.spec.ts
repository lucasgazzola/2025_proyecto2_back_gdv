import { MarcaService } from './marca.service';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

describe('MarcaService - gestión de marcas', () => {
  let service: MarcaService;
  const mockRepo: any = {
    findByName: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MarcaService(mockRepo);
  });

  it('When (1) name empty -> DTO validation message "El nombre es obligatorio"', async () => {
    const CreateDto = require('./dto/create-marca.dto').CreateMarcaDto;
    const dto = new CreateDto();
    dto.name = '';

    const errors = await validate(dto);
    const messages = errors.flatMap((e: any) => (e.constraints ? Object.values(e.constraints) : []));
    expect(messages).toContain('El nombre es obligatorio');
  });

  it('When (2) name already exists -> service throws "La marca ya existe"', async () => {
    const CreateDto = require('./dto/create-marca.dto').CreateMarcaDto;
    const dto = new CreateDto();
    dto.name = 'Existing';

    mockRepo.findByName.mockResolvedValue({ id: 1, name: 'Existing' });

    await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
    await expect(service.create(dto as any)).rejects.toThrow('La marca ya existe');
  });

  it('When (3) attempt to delete brand with active products -> service prevents deletion and throws error', async () => {
    // Simulate repo.delete throwing a BadRequestException when brand has active products
    mockRepo.delete.mockRejectedValue(new BadRequestException('No se puede eliminar marca con productos activos'));

    await expect(service.remove(10)).rejects.toThrow(BadRequestException);
    await expect(service.remove(10)).rejects.toThrow('No se puede eliminar marca con productos activos');
  });

  it('When (4) valid data -> create or update works correctly', async () => {
    const dto = { name: 'New Brand' };
    const created = { id: 11, name: 'New Brand', isActive: true };
    mockRepo.findByName.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue(created);

    const result = await service.create(dto as any);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(created);

    // Update path
    const updated = { id: 11, name: 'Updated Brand', isActive: true };
    mockRepo.update.mockResolvedValue(updated);
    mockRepo.findById.mockResolvedValue({ id: 11, name: 'New Brand' });

    const res2 = await service.update(11, { name: 'Updated Brand' } as any);
    expect(mockRepo.update).toHaveBeenCalledWith(11, expect.objectContaining({ name: 'Updated Brand' }));
    expect(res2).toEqual(updated);
  });
});
