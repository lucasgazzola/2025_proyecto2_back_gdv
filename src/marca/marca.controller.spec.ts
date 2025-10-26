import { ConflictException } from '@nestjs/common';
import { MarcaController } from './marca.controller';
import { MarcaService } from './marca.service';

describe('MarcaController (unit)', () => {
  let controller: MarcaController;

  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockLogs: any = {
    createSuccessLog: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new MarcaController(
      mockService as unknown as MarcaService,
      mockLogs as any,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create -> delega a service.create y crea log', async () => {
    const dto: any = { name: 'New Brand' };
    const req: any = { user: { id: 2, email: 'u@e.com' } };
    const created = { id: 11, name: 'New Brand' };
    mockService.create.mockResolvedValue(created);

    const res = await controller.create(dto, undefined, req);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
      'CREATE_BRAND',
      req.user.id,
      `Usuario ${req.user.email} creó marca: ${dto.name}`,
    );
    expect(res).toEqual(created);
  });

  it('create -> propaga conflicto cuando service lanza ConflictException', async () => {
    const dto: any = { name: 'Existing' };
    const req: any = { user: { id: 3, email: 'u2@e.com' } };
    mockService.create.mockRejectedValue(
      new ConflictException('La marca ya existe'),
    );
    await expect(controller.create(dto, undefined, req)).rejects.toThrow(
      ConflictException,
    );
  });

  it('findAll -> delega a service.findAll', () => {
    mockService.findAll.mockReturnValue([]);
    const res = controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
    expect(res).toEqual([]);
  });

  it('findById -> delega a service.findById', () => {
    mockService.findById.mockReturnValue({ id: 5 });
    const res = controller.findById(5);
    expect(mockService.findById).toHaveBeenCalledWith(5);
    expect(res).toEqual({ id: 5 });
  });

  it('findByName -> delega a service.findByName', () => {
    mockService.findByName.mockReturnValue({ id: 6 });
    const res = controller.findByName('X');
    expect(mockService.findByName).toHaveBeenCalledWith('X');
    expect(res).toEqual({ id: 6 });
  });

  it('update -> delega a service.update y crea log', async () => {
    const dto: any = { name: 'Updated' };
    const req: any = { user: { id: 4, email: 'u3@e.com' } };
    mockService.update.mockResolvedValue({ id: 7, ...dto });
    const res = await controller.update(7, dto, undefined, req);
    expect(mockService.update).toHaveBeenCalledWith(7, dto);
    expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
      'UPDATE_BRAND',
      req.user.id,
      `Usuario ${req.user.email} actualizó marca ID: ${7}`,
    );
    expect(res).toEqual({ id: 7, ...dto });
  });

  it('remove -> delega a service.remove y crea log', async () => {
    const req: any = { user: { id: 8, email: 'u4@e.com' } };
    mockService.remove.mockResolvedValue({ id: 9 });
    const res = await controller.remove(9, req);
    expect(mockService.remove).toHaveBeenCalledWith(9);
    expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
      'DELETE_BRAND',
      req.user.id,
      `Usuario ${req.user.email} eliminó marca ID: ${9}`,
    );
    expect(res).toEqual({ id: 9 });
  });
});
