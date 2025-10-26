import { ProveedorController } from './proveedor.controller';
import { ProveedorService } from './proveedor.service';

describe('ProveedorController', () => {
  let controller: ProveedorController;
  const mockService: any = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ProveedorController(mockService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create -> delegates to service.create', async () => {
    const dto: any = { code: 'X1', email: 'a@b.com' };
    mockService.create.mockResolvedValue({ id: 10, ...dto });

    const res = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ id: 10, ...dto });
  });

  it('findAll -> delegates to service.findAll', () => {
    mockService.findAll.mockReturnValue([]);
    const res = controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
    expect(res).toEqual([]);
  });

  it('findById -> delegates to service.findById', () => {
    mockService.findById.mockReturnValue({ id: 1 });
    const res = controller.findOne(1);
    expect(mockService.findById).toHaveBeenCalledWith(1);
    expect(res).toEqual({ id: 1 });
  });

  it('update -> delegates to service.update', async () => {
    const dto: any = { email: 'u@e.com' };
    mockService.update.mockResolvedValue({ id: 3 });

    const res = await controller.update(3, dto);
    expect(mockService.update).toHaveBeenCalledWith(3, dto);
    expect(res).toEqual({ id: 3 });
  });

  it('remove -> delegates to service.delete', async () => {
    mockService.delete.mockResolvedValue({ id: 4 });

    const res = await controller.delete(4);
    expect(mockService.delete).toHaveBeenCalledWith(4);
    expect(res).toEqual({ id: 4 });
  });
});
