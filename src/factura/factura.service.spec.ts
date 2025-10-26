import { FacturaService } from './factura.service';
import { BadRequestException } from '@nestjs/common';

describe('FacturaService (unit)', () => {
  let service: FacturaService;

  const mockRepo: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateState: jest.fn(),
    delete: jest.fn(),
  };

  const mockProductoRepo: any = {
    findByIds: jest.fn(),
  };

  const mockUserRepo: any = {
    findByEmail: jest.fn(),
  };

  const mockCustomerRepo: any = {
    findById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FacturaService(
      mockRepo,
      mockProductoRepo,
      mockUserRepo,
      mockCustomerRepo,
    );
  });

  it('When (1) intenta generar factura sin productos -> debe indicar al menos un producto', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1, email: 'u@e.com' });
    mockCustomerRepo.findById.mockResolvedValue({ id: 1 });
    const dto: any = { customerId: 1, invoiceDetails: [] };
    await expect(service.create(dto, 'u@e.com')).rejects.toThrow(
      /al menos un producto/i,
    );
  });

  it('When (2) genera factura sin cliente -> debe indicar seleccionar cliente', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1, email: 'u@e.com' });
    const dto: any = { invoiceDetails: [{ product: { id: 1 }, quantity: 1 }] };
    await expect(service.create(dto, 'u@e.com')).rejects.toThrow(/cliente/i);
  });

  it('When (3) producto sin stock disponible -> debe indicar Stock insuficiente', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1, email: 'u@e.com' });
    mockCustomerRepo.findById.mockResolvedValue({ id: 1 });
    // producto with stock 0
    mockProductoRepo.findByIds.mockResolvedValue([
      { id: 1, price: 10, stock: 0, name: 'P1' },
    ]);

    const dto: any = {
      customerId: 1,
      invoiceDetails: [{ product: { id: 1 }, quantity: 2 }],
    };
    await expect(service.create(dto, 'u@e.com')).rejects.toThrow(
      /stock insuficiente/i,
    );
  });

  it('When (4) datos válidos -> crea factura PENDING y descuenta stock (repositorio llamado)', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 2, email: 'user@e.com' });
    mockCustomerRepo.findById.mockResolvedValue({ id: 5 });
    mockProductoRepo.findByIds.mockResolvedValue([
      { id: 1, price: 50, stock: 10, name: 'P1' },
    ]);

    const createdInvoice = {
      id: 100,
      invoiceNumber: '123',
      userId: 2,
      customerId: 5,
      state: 'PENDING',
      items: [
        {
          id: 1,
          invoiceId: 100,
          productId: 1,
          quantity: 2,
          unitPrice: 50,
          subtotal: 100,
        },
      ],
      total: 100,
    };
    mockRepo.create.mockResolvedValue(createdInvoice);

    const dto: any = {
      customerId: 5,
      invoiceDetails: [{ product: { id: 1 }, quantity: 2 }],
    };
    const res = await service.create(dto, 'user@e.com');

    expect(mockProductoRepo.findByIds).toHaveBeenCalledWith([1]);
    expect(mockRepo.create).toHaveBeenCalled();
    expect(res).toEqual(createdInvoice);
    expect(res.state).toBe('PENDING');
  });

  it('When (5) usuario no encontrado -> lanza error', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    const dto: any = {
      customerId: 1,
      invoiceDetails: [{ product: { id: 1 }, quantity: 1 }],
    };
    await expect(service.create(dto, 'no-user@e.com')).rejects.toThrow(
      /Usuario no encontrado/i,
    );
  });

  it('When (6) producto id faltante en invoiceDetails -> lanza error', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1, email: 'u@e.com' });
    mockCustomerRepo.findById.mockResolvedValue({ id: 1 });
    const dto: any = {
      customerId: 1,
      invoiceDetails: [{ product: {}, quantity: 1 }],
    };
    await expect(service.create(dto, 'u@e.com')).rejects.toThrow(
      /Producto id inválido/i,
    );
  });

  it('When (7) producto id inválido (no numérico) -> lanza error', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1, email: 'u@e.com' });
    mockCustomerRepo.findById.mockResolvedValue({ id: 1 });
    const dto: any = {
      customerId: 1,
      invoiceDetails: [{ product: { id: 'abc' }, quantity: 1 }],
    };
    await expect(service.create(dto, 'u@e.com')).rejects.toThrow(
      /Producto id inválido/i,
    );
  });

  it('When (8) producto no encontrado tras findByIds -> lanza Producto no encontrado', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1, email: 'u@e.com' });
    mockCustomerRepo.findById.mockResolvedValue({ id: 1 });
    mockProductoRepo.findByIds.mockResolvedValue([]);
    const dto: any = {
      customerId: 1,
      invoiceDetails: [{ product: { id: 99 }, quantity: 1 }],
    };
    await expect(service.create(dto, 'u@e.com')).rejects.toThrow(
      /Producto no encontrado/i,
    );
  });

  it('When (9) producto con precio inválido -> lanza error de precio', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 1, email: 'u@e.com' });
    mockCustomerRepo.findById.mockResolvedValue({ id: 1 });
    mockProductoRepo.findByIds.mockResolvedValue([
      { id: 5, price: 0, stock: 10, name: 'P0' },
    ]);
    const dto: any = {
      customerId: 1,
      invoiceDetails: [{ product: { id: 5 }, quantity: 1 }],
    };
    await expect(service.create(dto, 'u@e.com')).rejects.toThrow(/precio/i);
  });

  it('When (10) acepta product id con sufijo "14-xxx" y normaliza', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: 2, email: 'u@e.com' });
    mockCustomerRepo.findById.mockResolvedValue({ id: 5 });
    mockProductoRepo.findByIds.mockResolvedValue([
      { id: 14, price: 50, stock: 10, name: 'P1' },
    ]);
    const createdInvoice = {
      id: 999,
      invoiceNumber: '999',
      userId: 2,
      customerId: 5,
      state: 'PENDING',
      items: [],
      total: 50,
    };
    mockRepo.create.mockResolvedValue(createdInvoice);

    const dto: any = {
      customerId: 5,
      invoiceDetails: [{ product: { id: '14-1761443148092' }, quantity: 1 }],
    };
    const res = await service.create(dto, 'u@e.com');
    expect(mockProductoRepo.findByIds).toHaveBeenCalledWith([14]);
    expect(res).toEqual(createdInvoice);
  });

  describe('changeState edge cases', () => {
    it('When factura no encontrada -> lanza BadRequestException', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.changeState(1, 'PAID')).rejects.toThrow(
        /Factura no encontrada/i,
      );
    });

    it('When factura no en PENDING -> lanza error de transición', async () => {
      mockRepo.findById.mockResolvedValue({ id: 2, state: 'PAID' });
      await expect(service.changeState(2, 'CANCELLED')).rejects.toThrow(
        /Solo se permiten transiciones desde PENDING/i,
      );
    });

    it('When state inválido -> lanza Estado inválido', async () => {
      mockRepo.findById.mockResolvedValue({ id: 3, state: 'PENDING' });
      // @ts-ignore force invalid
      await expect(service.changeState(3, 'INVALID')).rejects.toThrow(
        /Estado inválido/i,
      );
    });

    it('When repo.updateState lanza -> captura y lanza BadRequestException con mensaje', async () => {
      mockRepo.findById.mockResolvedValue({ id: 4, state: 'PENDING' });
      mockRepo.updateState.mockRejectedValue(new Error('DB failure'));
      await expect(service.changeState(4, 'PAID')).rejects.toThrow(
        /DB failure/i,
      );
    });
  });
});
