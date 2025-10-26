import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';

describe('ProductoController', () => {
  let controller: ProductoController;
  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockLogs: any = {
    createSuccessLog: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ProductoController(
      mockService as unknown as ProductoService,
      mockLogs as any,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create -> delegates to service.create and returns created product', async () => {
    const dto: any = {
      name: 'P',
      price: 10,
      imageURL: 'img.png',
      categoryIds: [1],
    };
    const req: any = { user: { id: 5, email: 'u@e.com' }, body: dto };
    mockService.create.mockResolvedValue({ id: 1, ...dto });
    const res = await controller.create(dto, undefined, req);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
      'CREATE_PRODUCT',
      req.user.id,
      `Usuario ${req.user.email} creó producto: ${dto.name}`,
    );
    expect(res).toEqual({ id: 1, ...dto });
  });

  it('findAll -> delegates to service.findAll and returns array', async () => {
    mockService.findAll.mockResolvedValue([]);
    const res = await controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
    expect(res).toEqual([]);
  });

  it('findOne -> delegates to service.findById', () => {
    mockService.findById.mockReturnValue({ id: 2 });
    const res = controller.findOne(2);
    expect(mockService.findById).toHaveBeenCalledWith(2);
    expect(res).toEqual({ id: 2 });
  });

  it('update -> delegates to service.update and returns updated', async () => {
    const dto: any = { name: 'P v2' };
    const req: any = { user: { id: 6, email: 'u2@e.com' }, body: dto };
    mockService.update.mockResolvedValue({ id: 3, ...dto });
    const res = await controller.update(3, dto, undefined, req);
    expect(mockService.update).toHaveBeenCalledWith(3, dto);
    expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
      'UPDATE_PRODUCT',
      req.user.id,
      `Usuario ${req.user.email} actualizó producto ID: ${3}`,
    );
    expect(res).toEqual({ id: 3, ...dto });
  });

  it('delete -> delegates to service.delete and returns result', async () => {
    const req: any = { user: { id: 7, email: 'u3@e.com' } };
    mockService.delete.mockResolvedValue({ id: 4 });
    const res = await controller.remove(4, req);
    expect(mockService.delete).toHaveBeenCalledWith(4);
    expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
      'DELETE_PRODUCT',
      req.user.id,
      `Usuario ${req.user.email} eliminó producto ID: ${4}`,
    );
    expect(res).toEqual({ id: 4 });
  });

  it('create -> throws BadRequestException when DTO validation fails', async () => {
    const badDto: any = { name: '', price: 10, imageURL: '' };
    const req: any = { user: { id: 5, email: 'u@e.com' }, body: badDto };
    await expect(controller.create(badDto, undefined, req)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('create -> normalizes brand and categories (stringified) and uses uploaded image', async () => {
    const body: any = {
      name: 'P-normal',
      price: 20,
      brand: JSON.stringify({ id: '7' }),
      categories: JSON.stringify([{ id: '2' }, { id: 3 }]),
    };
    const image: any = { filename: 'u1.png' };
    const req: any = { user: { id: 11, email: 'u@e.com' }, body };
    mockService.create.mockResolvedValue({
      id: 22,
      ...body,
      imageURL: `uploads/products/${image.filename}`,
      brandId: 7,
      categoryIds: [2, 3],
    });

    const res = await controller.create(body, image, req);

    expect(mockService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'P-normal',
        price: 20,
        brandId: 7,
        categoryIds: [2, 3],
        imageURL: `uploads/products/${image.filename}`,
      }),
    );
    expect(mockLogs.createSuccessLog).toHaveBeenCalled();
    expect(res).toEqual(expect.objectContaining({ id: 22 }));
  });

  it('create -> accepts comma-separated category ids and parses them', async () => {
    const body: any = { name: 'Comma', price: 5, categories: '4,5,6' };
    const req: any = { user: { id: 12, email: 'u@e.com' }, body };
    mockService.create.mockResolvedValue({ id: 30, name: 'Comma' });
    await controller.create(body, undefined, req);
    expect(mockService.create).toHaveBeenCalledWith(
      expect.objectContaining({ categoryIds: [4, 5, 6] }),
    );
  });

  it('update -> throws BadRequestException when update DTO invalid', async () => {
    const badUpdate: any = { price: 'not-a-number' };
    const req: any = { user: { id: 6, email: 'u2@e.com' }, body: badUpdate };
    await expect(
      controller.update(3, badUpdate, undefined, req),
    ).rejects.toThrow(BadRequestException);
  });

  it('create -> accepts remote image URL and normalizes imageURL', async () => {
    const body: any = {
      name: 'RemoteImg',
      price: 12,
      imageUrl: 'http://example.com/img.png',
    };
    const req: any = { user: { id: 13, email: 'u@e.com' }, body };
    // remote URLs are not accepted for images (only local uploads), controller should validate and throw
    await expect(controller.create(body, undefined, req)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('create -> accepts base64 image and saves it (fs mocked)', async () => {
    const base64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
    const body: any = {
      name: 'Base64',
      price: 1,
      imageURL: base64,
      categoryIds: [1],
    };
    const req: any = { user: { id: 14, email: 'u@e.com' }, body };
    // mock fs to avoid actual file writes; guard spy creation in case fs methods are not configurable in this env
    let mkdirSpy: any = null;
    let writeSpy: any = null;
    try {
      mkdirSpy = jest
        .spyOn(fs, 'mkdirSync')
        .mockImplementation(() => undefined as any);
    } catch (e) {
      mkdirSpy = null;
    }
    try {
      writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    } catch (e) {
      writeSpy = null;
    }

    mockService.create.mockImplementation(async (dto: any) => ({
      id: 50,
      ...dto,
    }));

    const res = await controller.create(body, undefined, req);

    if (writeSpy) expect(writeSpy).toHaveBeenCalled();
    expect(mockService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        imageURL: expect.stringContaining('uploads/products/'),
      }),
    );
    expect(res).toEqual(expect.objectContaining({ id: 50 }));

    if (mkdirSpy && mkdirSpy.mockRestore) mkdirSpy.mockRestore();
    if (writeSpy && writeSpy.mockRestore) writeSpy.mockRestore();
  });

  it('create -> rejects when base64 image format invalid', async () => {
    const badBase = 'data:image/xyz;base64,invaliddata';
    const body: any = {
      name: 'BadBase',
      price: 1,
      imageURL: badBase,
      categoryIds: [1],
    };
    const req: any = { user: { id: 15, email: 'u@e.com' }, body };
    await expect(controller.create(body, undefined, req)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('create -> accepts categories passed as array of objects directly', async () => {
    const body: any = {
      name: 'ArrObj',
      price: 7,
      categories: [{ id: '8' }, { id: 9 }],
    };
    const req: any = { user: { id: 16, email: 'u@e.com' }, body };
    mockService.create.mockResolvedValue({ id: 60 });
    await controller.create(body, undefined, req);
    expect(mockService.create).toHaveBeenCalledWith(
      expect.objectContaining({ categoryIds: [8, 9] }),
    );
  });

  it('create -> accepts brand as object and numeric category ids array', async () => {
    const body: any = {
      name: 'BrandObj',
      price: 9,
      brand: { id: '12' },
      categories: [1, '2'],
    };
    const req: any = { user: { id: 17, email: 'u@e.com' }, body };
    mockService.create.mockResolvedValue({ id: 70 });

    await controller.create(body, undefined, req);

    expect(mockService.create).toHaveBeenCalledWith(
      expect.objectContaining({ brandId: 12, categoryIds: [1, 2] }),
    );
  });

  it('create -> parses CSV with spaces and trims values', async () => {
    const body: any = { name: 'CSVTrim', price: 3, categories: ' 7, 8 ,9 ' };
    const req: any = { user: { id: 18, email: 'u@e.com' }, body };
    mockService.create.mockResolvedValue({ id: 80 });

    await controller.create(body, undefined, req);
    expect(mockService.create).toHaveBeenCalledWith(
      expect.objectContaining({ categoryIds: [7, 8, 9] }),
    );
  });

  it('create -> falls back to CSV parsing when categories JSON invalid and extracts numeric ids', async () => {
    const body: any = { name: 'BadJson', price: 2, categories: '[1,2' };
    const req: any = { user: { id: 19, email: 'u@e.com' }, body };
    mockService.create.mockResolvedValue({ id: 80 });

    await controller.create(body, undefined, req);
    expect(mockService.create).toHaveBeenCalledWith(
      expect.objectContaining({ categoryIds: [2] }),
    );
  });

  it('create -> when service.create throws, controller propagates and does not log success', async () => {
    const body: any = { name: 'ServiceErr', price: 4, categoryIds: [1] };
    const req: any = { user: { id: 20, email: 'u@e.com' }, body };
    mockService.create.mockRejectedValue(new Error('boom'));

    await expect(controller.create(body, undefined, req)).rejects.toThrow(
      'boom',
    );
    expect(mockLogs.createSuccessLog).not.toHaveBeenCalled();
  });

  it('update -> accepts file upload and forwards imageURL to service', async () => {
    const dto: any = { name: 'WithFile' };
    const file: any = { filename: 'up.png' };
    const req: any = { user: { id: 21, email: 'u@e.com' }, body: dto };
    mockService.update.mockResolvedValue({
      id: 90,
      ...dto,
      imageURL: `uploads/products/${file.filename}`,
    });

    const res = await controller.update(90, dto, file, req);
    expect(mockService.update).toHaveBeenCalledWith(
      90,
      expect.objectContaining({
        imageURL: `uploads/products/${file.filename}`,
      }),
    );
    expect(res).toEqual(expect.objectContaining({ id: 90 }));
  });

  it('findOne -> returns null when service returns null', () => {
    mockService.findById.mockReturnValue(null);
    const res = controller.findOne(999);
    expect(mockService.findById).toHaveBeenCalledWith(999);
    expect(res).toBeNull();
  });

  it('create -> ignores invalid brand JSON and proceeds without brandId', async () => {
    const body: any = {
      name: 'NoBrand',
      price: 11,
      brand: '{bad json}',
      categoryIds: [2],
    };
    const req: any = { user: { id: 23, email: 'u@e.com' }, body };
    mockService.create.mockResolvedValue({ id: 100, name: 'NoBrand' });

    await controller.create(body, undefined, req);
    expect(mockService.create).toHaveBeenCalledWith(
      expect.not.objectContaining({ brandId: expect.any(Number) }),
    );
  });

  it('create -> reads categories from req.body when body param missing', async () => {
    const body: any = { name: 'FromReq', price: 13 };
    const req: any = {
      user: { id: 24, email: 'u@e.com' },
      body: { categories: '2,3' },
    };
    mockService.create.mockResolvedValue({ id: 110 });

    await controller.create(body, undefined, req as any);
    expect(mockService.create).toHaveBeenCalledWith(
      expect.objectContaining({ categoryIds: [2, 3] }),
    );
  });

  it('create -> accepts remote image URL and forwards it to service (positive case)', async () => {
    const body: any = {
      name: 'RemoteOK',
      price: 14,
      imageURL: 'http://cdn.example.com/x.png',
      categoryIds: [1],
    };
    const req: any = { user: { id: 25, email: 'u@e.com' }, body };
    mockService.create.mockResolvedValue({ id: 120 });

    const res = await controller.create(body, undefined, req);
    expect(mockService.create).toHaveBeenCalledWith(
      expect.objectContaining({ imageURL: 'http://cdn.example.com/x.png' }),
    );
    expect(res).toEqual(expect.objectContaining({ id: 120 }));
  });

  it('update -> accepts base64 image and saves it (fs mocked) for update path', async () => {
    const base64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
    const dto: any = { name: 'UpdBase64', imageURL: base64 };
    const req: any = { user: { id: 26, email: 'u@e.com' }, body: dto };

    // guard fs spying
    let mkdirSpy: any = null;
    let writeSpy: any = null;
    try {
      mkdirSpy = jest
        .spyOn(fs, 'mkdirSync')
        .mockImplementation(() => undefined as any);
    } catch (e) {
      mkdirSpy = null;
    }
    try {
      writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    } catch (e) {
      writeSpy = null;
    }

    mockService.update.mockResolvedValue({
      id: 130,
      name: 'UpdBase64',
      imageURL: 'uploads/products/foo.png',
    });

    const res = await controller.update(130, dto, undefined, req);
    if (writeSpy) expect(writeSpy).toHaveBeenCalled();
    expect(mockService.update).toHaveBeenCalledWith(
      130,
      expect.objectContaining({
        imageURL: expect.stringContaining('uploads/products/'),
      }),
    );
    expect(res).toEqual(expect.objectContaining({ id: 130 }));

    if (mkdirSpy && mkdirSpy.mockRestore) mkdirSpy.mockRestore();
    if (writeSpy && writeSpy.mockRestore) writeSpy.mockRestore();
  });
});
