import { BadRequestException } from '@nestjs/common';
import { FacturaController } from './factura.controller';
import { FacturaService } from './factura.service';

describe('FacturaController (unit)', () => {
  let controller: FacturaController;

  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    changeState: jest.fn(),
  };

  const mockLogs: any = {
    createSuccessLog: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new FacturaController(
      mockService as unknown as FacturaService,
      mockLogs as any,
    );
  });

  it('When (1) intenta generar factura sin productos -> propaga error del servicio', async () => {
    const dto: any = { customerId: 1, invoiceDetails: [] };
    const req: any = { user: { id: 1, email: 'u@e.com' } };
    mockService.create.mockRejectedValue(
      new BadRequestException('Al menos un producto es requerido'),
    );
    await expect(controller.create(dto, req)).rejects.toThrow(/producto/i);
  });

  it('When (2) genera factura sin cliente -> propaga error del servicio', async () => {
    const dto: any = { invoiceDetails: [{ product: { id: 1 }, quantity: 1 }] };
    const req: any = { user: { id: 2, email: 'u@e.com' } };
    mockService.create.mockRejectedValue(
      new BadRequestException('Cliente no encontrado'),
    );
    await expect(controller.create(dto, req)).rejects.toThrow(/cliente/i);
  });

  it('When (3) producto sin stock disponible -> propaga error del servicio', async () => {
    const dto: any = {
      customerId: 1,
      invoiceDetails: [{ product: { id: 1 }, quantity: 2 }],
    };
    const req: any = { user: { id: 3, email: 'u@e.com' } };
    mockService.create.mockRejectedValue(
      new BadRequestException('Stock insuficiente'),
    );
    await expect(controller.create(dto, req)).rejects.toThrow(
      /stock insuficiente/i,
    );
  });

  it('When (4) datos válidos -> delega a servicio, retorna factura y crea log', async () => {
    const dto: any = {
      customerId: 5,
      invoiceDetails: [{ product: { id: 1 }, quantity: 2 }],
    };
    const req: any = { user: { id: 10, email: 'user@e.com' } };
    const createdInvoice = { id: 200, total: 100, state: 'PENDING' };
    mockService.create.mockResolvedValue(createdInvoice);

    const res = await controller.create(dto, req);

    expect(mockService.create).toHaveBeenCalledWith(dto, req.user.email);
    expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
      'CREATE_INVOICE',
      req.user.id,
      `Usuario ${req.user.email} creó factura ID: ${createdInvoice.id}`,
    );
    expect(res).toEqual(createdInvoice);
  });

  it('findAll -> delega a service.findAll', () => {
    mockService.findAll.mockReturnValue([]);
    const res = controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
    expect(res).toEqual([]);
  });

  it('findById -> delega a service.findById', () => {
    mockService.findById.mockReturnValue({ id: 7 });
    const res = controller.findById(7);
    expect(mockService.findById).toHaveBeenCalledWith(7);
    expect(res).toEqual({ id: 7 });
  });

  it('changeState -> valida body y delega', async () => {
    mockService.changeState.mockResolvedValue({ id: 9, state: 'PAID' });
    const res = await controller.changeState(9, { state: 'PAID' });
    expect(mockService.changeState).toHaveBeenCalledWith(9, 'PAID');
    expect(res).toEqual({ id: 9, state: 'PAID' });
  });
});
