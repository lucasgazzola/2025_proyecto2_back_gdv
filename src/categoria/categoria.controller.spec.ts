import { BadRequestException } from '@nestjs/common';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';

describe('CategoriaController', () => {
  let controller: CategoriaController;
  const mockService: any = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CategoriaController(
      mockService as unknown as CategoriaService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create -> delegates to service.create and returns created', async () => {
    const dto: any = { name: 'New Cat' };
    mockService.create.mockResolvedValue({ id: 1, ...dto });
    const res = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ id: 1, ...dto });
  });

  it('create -> propagates BadRequestException when service throws', async () => {
    const dto: any = { name: 'Existing' };
    mockService.create.mockRejectedValue(
      new BadRequestException('El nombre de categoría ya existe'),
    );
    await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('findAll -> delegates to service.findAll', () => {
    mockService.findAll.mockReturnValue([]);
    const res = controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
    expect(res).toEqual([]);
  });

  it('findOne -> delegates to service.findById', async () => {
    mockService.findById.mockResolvedValue({ id: 5 });
    const res = await controller.findOne(5);
    expect(mockService.findById).toHaveBeenCalledWith(5);
    expect(res).toEqual({ id: 5 });
  });

  it('update -> delegates to service.update and returns updated', async () => {
    const dto: any = { name: 'Updated' };
    mockService.update.mockResolvedValue({ id: 7, ...dto });
    const res = await controller.update(7, dto);
    expect(mockService.update).toHaveBeenCalledWith(7, dto);
    expect(res).toEqual({ id: 7, ...dto });
  });

  it('delete -> delegates to service.delete and returns result', async () => {
    mockService.delete.mockResolvedValue(undefined);
    const res = await controller.delete(9);
    expect(mockService.delete).toHaveBeenCalledWith(9);
    expect(res).toBeUndefined();
  });
});
