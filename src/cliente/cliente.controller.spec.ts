import { validate } from 'class-validator';
import { ClienteController } from './cliente.controller';
import { CreateClienteDto } from './dto/create-cliente.dto';

describe('ClienteController', () => {
  let controller: ClienteController;
  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockLogs: any = {
    createSuccessLog: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ClienteController(mockService, mockLogs);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('DTO validation (CreateClienteDto)', () => {
    it('When (1) firstName, lastName or dni empty -> DTO validation messages', async () => {
      const dto = new CreateClienteDto();
      dto.firstName = '';
      dto.lastName = '';
      dto.email = 'bad@example.com';
      dto.dni = '';

      const errors = await validate(dto as any);
      const messages = errors.flatMap((e: any) =>
        e.constraints ? Object.values(e.constraints) : [],
      );
      expect(messages).toContain('El nombre es obligatorio');
      expect(messages).toContain('El apellido es obligatorio');
      expect(messages).toContain('El DNI es obligatorio');
    });
  });

  describe('Controller methods', () => {
    it('create -> delegates to service.create and logs', async () => {
      const dto: any = { email: 'a@b.com' };
      const req: any = { user: { id: 5, email: 'u@e.com' } };
      mockService.create.mockResolvedValue({ id: 10, email: dto.email });

      const res = await controller.create(dto, req);
      expect(mockService.create).toHaveBeenCalledWith(dto);
      expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
        'CREATE_CLIENTE',
        req.user.id,
        `Usuario ${req.user.email} creó nuevo cliente: ${dto.email}`,
      );
      expect(res).toEqual({ id: 10, email: dto.email });
    });

    it('findAll -> delegates to service.findAll', () => {
      mockService.findAll.mockReturnValue([]);
      const res = controller.findAll();
      expect(mockService.findAll).toHaveBeenCalled();
      expect(res).toEqual([]);
    });

    it('findByEmail -> delegates to service.findByEmail', () => {
      mockService.findByEmail.mockReturnValue({ id: 1 });
      const res = controller.findByEmail('x@x.com');
      expect(mockService.findByEmail).toHaveBeenCalledWith('x@x.com');
      expect(res).toEqual({ id: 1 });
    });

    it('findById -> delegates to service.findById', () => {
      mockService.findById.mockReturnValue({ id: 2 });
      const res = controller.findById(2);
      expect(mockService.findById).toHaveBeenCalledWith(2);
      expect(res).toEqual({ id: 2 });
    });

    it('update -> delegates to service.update and logs', async () => {
      const dto: any = { email: 'u@e.com' };
      const req: any = { user: { id: 7, email: 'u@e.com' } };
      mockService.update.mockResolvedValue({ id: 3 });

      const res = await controller.update(3, dto, req);
      expect(mockService.update).toHaveBeenCalledWith(3, dto);
      expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
        'UPDATE_CLIENTE',
        req.user.id,
        `Usuario ${req.user.email} actualizó cliente ID: ${3}`,
      );
      expect(res).toEqual({ id: 3 });
    });

    it('remove -> delegates to service.delete and logs', async () => {
      const req: any = { user: { id: 9, email: 'u@e.com' } };
      mockService.delete.mockResolvedValue({ id: 4 });

      const res = await controller.remove(4, req);
      expect(mockService.delete).toHaveBeenCalledWith(4);
      expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
        'DELETE_CLIENTE',
        req.user.id,
        `Usuario ${req.user.email} eliminó cliente ID: ${4}`,
      );
      expect(res).toEqual({ id: 4 });
    });
  });
});
