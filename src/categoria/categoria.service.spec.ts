import { CategoriaService } from './categoria.service';
import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

describe('CategoriaService - gestión de categorías', () => {
  let service: CategoriaService;
  const mockRepo: any = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CategoriaService(mockRepo);
  });

  it('When (1) name empty -> DTO validation message "El nombre es obligatorio"', async () => {
    const CreateDto = require('./dto/create-categoria.dto').CreateCategoriaDto;
    const dto = new CreateDto();
    dto.name = '';
    dto.description = '';

    const errors = await validate(dto);
    const messages = errors.flatMap((e: any) => (e.constraints ? Object.values(e.constraints) : []));
    expect(messages).toContain('El nombre es obligatorio');
  });

  it('When (2) name already exists -> service throws "El nombre de categoría ya existe"', async () => {
    const CreateDto = require('./dto/create-categoria.dto').CreateCategoriaDto;
    const dto = new CreateDto();
    dto.name = 'Existing';

    mockRepo.findByName.mockResolvedValue({ id: 1, name: 'Existing' });

    await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
    await expect(service.create(dto as any)).rejects.toThrow('El nombre de categoría ya existe');
  });

  it('When (3) edit category with valid data -> updates correctly', async () => {
    const existing = { id: 5, name: 'Old', isActive: true };
    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.findByName.mockResolvedValue(null);
    const updated = { id: 5, name: 'New', isActive: true };
    mockRepo.update.mockResolvedValue(updated);

    const result = await service.update(5, { name: 'New' } as any);
    expect(mockRepo.update).toHaveBeenCalledWith(5, expect.objectContaining({ name: 'New' }));
    expect(result).toEqual(updated);
  });

  it('When (4) delete existing category -> deletes and list updates', async () => {
    const existing = { id: 9, name: 'ToDelete', isActive: true };
    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.delete.mockResolvedValue(undefined);
    mockRepo.findAll.mockResolvedValue([{ id: 1, name: 'A' }]);

    await service.delete(9);
    expect(mockRepo.delete).toHaveBeenCalledWith(9);

    const list = await service.findAll();
    expect(list).toEqual([{ id: 1, name: 'A' }]);
  });
});
