import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { LogsService } from '../logs/logs.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Role } from '../common/enums/roles.enums';

describe('UsuarioController (unit)', () => {
  let controller: UsuarioController;
  const mockService: any = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    changePassword: jest.fn(),
  };

  const mockLogs: any = {
    createSuccessLog: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new UsuarioController(
      mockService as unknown as UsuarioService,
      mockLogs as LogsService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update role cases (from service)', () => {
    it('When (1) modifying role of non-existent user -> controller throws NotFoundException', async () => {
      mockService.update.mockRejectedValue(
        new NotFoundException('Usuario no encontrado'),
      );
      const req: any = { user: { id: 1, email: 'a@b.com' } };
      await expect(
        controller.update(123, { role: Role.ADMIN } as any, req),
      ).rejects.toThrow(NotFoundException);
      await expect(
        controller.update(123, { role: Role.ADMIN } as any, req),
      ).rejects.toThrow('Usuario no encontrado');
    });

    it('When (2) admin selects invalid role -> controller throws BadRequestException', async () => {
      mockService.update.mockRejectedValue(
        new BadRequestException('Rol no válido'),
      );
      const req: any = { user: { id: 1, email: 'a@b.com' } };
      await expect(
        controller.update(5, { role: 'INVALID_ROLE' } as any, req),
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.update(5, { role: 'INVALID_ROLE' } as any, req),
      ).rejects.toThrow('Rol no válido');
    });

    it('When (3) assign valid role -> controller returns updated user and logs action', async () => {
      const existing = { id: 7, email: 'user@example.com', role: Role.USER };
      const updated = { ...existing, role: Role.ADMIN };
      mockService.update.mockResolvedValue(updated);
      const req: any = { user: { id: 99, email: 'admin@example.com' } };

      const res = await controller.update(
        existing.id,
        { role: Role.ADMIN } as any,
        req,
      );
      expect(mockService.update).toHaveBeenCalledWith(
        existing.id,
        expect.objectContaining({ role: Role.ADMIN }),
      );
      expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
        'UPDATE_USER',
        req.user.id,
        `Usuario ${req.user.email} actualizó usuario ID: ${existing.id}`,
      );
      expect(res).toEqual(updated);
    });
  });

  describe('other controller endpoints', () => {
    it('getProfile -> returns user from service.findById', () => {
      const user = { id: 2, email: 'me@me.com' };
      mockService.findById.mockReturnValue(user);
      const req: any = { user: { id: 2 } };
      const res = controller.getProfile(req as any);
      expect(mockService.findById).toHaveBeenCalledWith(2);
      expect(res).toEqual(user);
    });

    it('create -> delegates to service.create and logs', async () => {
      const dto: any = {
        email: 'new@u.com',
        firstName: 'A',
        lastName: 'B',
        password: 'Abc123',
      };
      const req: any = { user: { id: 5, email: 'admin@x.com' } };
      mockService.create.mockResolvedValue({ id: 10, email: dto.email });

      const res = await controller.create(dto as any, req as any);
      expect(mockService.create).toHaveBeenCalledWith(dto);
      expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
        'CREATE_USER',
        req.user.id,
        expect.stringContaining(dto.email),
      );
      expect(res).toEqual({ id: 10, email: dto.email });
    });

    it('findAll -> delegates to service.findAll', () => {
      mockService.findAll.mockReturnValue([{ id: 1 }]);
      expect(controller.findAll()).toEqual([{ id: 1 }]);
      expect(mockService.findAll).toHaveBeenCalled();
    });

    it('findByEmail -> delegates to service.findByEmail', () => {
      mockService.findByEmail.mockReturnValue({ id: 3, email: 'x@y.com' });
      const res = controller.findByEmail('x@y.com');
      expect(mockService.findByEmail).toHaveBeenCalledWith('x@y.com');
      expect(res).toEqual({ id: 3, email: 'x@y.com' });
    });

    it('findById -> delegates to service.findById', () => {
      mockService.findById.mockReturnValue({ id: 4 });
      const res = controller.findById(4 as any);
      expect(mockService.findById).toHaveBeenCalledWith(4);
      expect(res).toEqual({ id: 4 });
    });

    it('remove -> when service throws NotFoundException it propagates and does not log', async () => {
      mockService.remove.mockRejectedValue(
        new NotFoundException('Usuario no encontrado'),
      );
      const req: any = { user: { id: 6, email: 'adm@x.com' } };
      await expect(controller.remove(99, req)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLogs.createSuccessLog).not.toHaveBeenCalled();
    });

    it('remove -> success calls service.remove and logs', async () => {
      mockService.remove.mockResolvedValue({ id: 7 });
      const req: any = { user: { id: 6, email: 'adm@x.com' } };
      const res = await controller.remove(7, req);
      expect(mockService.remove).toHaveBeenCalledWith(7);
      expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
        'DELETE_USER',
        req.user.id,
        expect.stringContaining(String(7)),
      );
      expect(res).toEqual({ id: 7 });
    });

    it('changePassword -> rejects when req.user.email mismatches param', async () => {
      const dto: any = {
        old_password: 'x',
        new_password: 'A1b2C3',
        password_confirm: 'A1b2C3',
      };
      const req: any = { user: { id: 8, email: 'me@x.com' } };
      await expect(
        controller.changePassword('other@x.com', dto, req),
      ).rejects.toThrow(BadRequestException);
    });

    it('changePassword -> rejects when new passwords do not match', async () => {
      const dto: any = {
        old_password: 'x',
        new_password: 'A1b2',
        password_confirm: 'DIFF',
      };
      const req: any = { user: { id: 8, email: 'me@x.com' } };
      await expect(
        controller.changePassword('me@x.com', dto, req),
      ).rejects.toThrow(BadRequestException);
    });

    it('changePassword -> delegates to service and logs on success', async () => {
      mockService.changePassword.mockResolvedValue({ ok: true });
      const dto: any = {
        old_password: 'old',
        new_password: 'New123',
        password_confirm: 'New123',
      };
      const req: any = { user: { id: 8, email: 'me@x.com' } };
      const res = await controller.changePassword('me@x.com', dto, req as any);
      expect(mockService.changePassword).toHaveBeenCalledWith(
        'me@x.com',
        'old',
        'New123',
      );
      expect(mockLogs.createSuccessLog).toHaveBeenCalledWith(
        'CHANGE_PASSWORD',
        req.user.id,
        expect.stringContaining(req.user.email),
      );
      expect(res).toEqual({ ok: true });
    });
  });
});
