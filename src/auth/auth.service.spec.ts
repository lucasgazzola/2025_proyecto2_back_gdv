import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.dto';
import { validate } from 'class-validator';
// Mock bcrypt at module level to avoid spyOn errors on non-configurable properties
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(async () => 'hashed'),
}));
const bcrypt: any = require('bcrypt');
import { Role } from '../common/enums/roles.enums';
import * as jwt from 'jsonwebtoken';
import { config } from '../common/config/jwtConfig';

describe('AuthService (unit)', () => {
  let authService: AuthService;
  const mockUsersService: any = {
    findByEmailWithPassword: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const mockMailService: any = { send: jest.fn() };
  const mockLogsService: any = {
    createFailureLog: jest.fn(),
    createSuccessLog: jest.fn(),
  };

  beforeEach(() => {
    // Restore any spies/mocks to avoid 'Cannot redefine property' errors
    jest.restoreAllMocks();
    jest.clearAllMocks();
    authService = new AuthService(
      mockUsersService,
      mockMailService,
      mockLogsService,
    );
  });

  describe('DTO validation (class-validator)', () => {
    it('When (1) email empty -> validation message "El email no puede estar vacío"', async () => {
      const dto = new LoginAuthDto();
      dto.email = '';
      dto.password = 'validpass';

      const errors = await validate(dto);
      const messages = errors.flatMap((e) =>
        e.constraints ? Object.values(e.constraints) : [],
      );
      expect(messages).toContain('El email no puede estar vacío');
    });

    it('When (2) password empty -> validation message "La contraseña no puede estar vacía"', async () => {
      const dto = new LoginAuthDto();
      dto.email = 'user@example.com';
      dto.password = '';

      const errors = await validate(dto);
      const messages = errors.flatMap((e) =>
        e.constraints ? Object.values(e.constraints) : [],
      );
      expect(messages).toContain('La contraseña no puede estar vacía');
    });

    it('When (3) invalid email format -> validation message "El formato del email no es válido"', async () => {
      const dto = new LoginAuthDto();
      dto.email = 'usuario@correo';
      dto.password = 'validpass';

      const errors = await validate(dto);
      const messages = errors.flatMap((e) =>
        e.constraints ? Object.values(e.constraints) : [],
      );
      expect(messages).toContain('El formato del email no es válido');
    });
  });

  describe('AuthService.login behavior', () => {
    beforeEach(() => {
      // default: no user found
      mockUsersService.findByEmailWithPassword.mockResolvedValue(null);
    });

    it('When (3a) user not found -> logs failure and throws', async () => {
      const dto = new LoginAuthDto();
      dto.email = 'nouser@example.com';
      dto.password = 'any';

      mockUsersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockLogsService.createFailureLog).toHaveBeenCalledWith(
        'LOGIN',
        undefined,
        expect.stringContaining(dto.email),
      );
    });

    it('When (4) valid format but incorrect credentials -> throws UnauthorizedException with "Credenciales inválidas"', async () => {
      const dto = new LoginAuthDto();
      dto.email = 'valid@example.com';
      dto.password = 'wrongpass';

      // Simulate user exists
      const user = {
        id: 1,
        email: dto.email,
        password: 'hashed',
        role: Role.USER,
      };
      mockUsersService.findByEmailWithPassword.mockResolvedValue(user);

      // Mock bcrypt.compare to return false for wrongpass
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(async (pass: string) => pass === 'correctpass');

      await expect(authService.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.login(dto)).rejects.toThrow(
        'Credenciales inválidas',
      );
    });

    it('When (5) valid credentials -> returns tokens', async () => {
      const dto = new LoginAuthDto();
      dto.email = 'valid@example.com';
      dto.password = 'correctpass';

      const user = {
        id: 2,
        email: dto.email,
        password: 'hashed',
        role: Role.USER,
      };
      mockUsersService.findByEmailWithPassword.mockResolvedValue(user);

      // Mock bcrypt.compare to return true for correctpass
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(async (pass: string) => pass === 'correctpass');

      const result = await authService.login(dto);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockLogsService.createSuccessLog).toHaveBeenCalledWith(
        'LOGIN',
        user.id,
        expect.stringContaining(user.email),
      );
    });
  });

  describe('AuthService.register behavior', () => {
    it('When (1) all fields empty -> returns required field messages', async () => {
      const dto = new (require('./dto/register.dto').RegisterAuthDto)();
      dto.email = '';
      dto.firstName = '';
      dto.lastName = '';
      dto.password = '';
      dto.confirmPassword = '';

      const errors = await validate(dto);
      const messages = errors.flatMap((e) =>
        e.constraints ? Object.values(e.constraints) : [],
      );
      // Expect that there are messages for required fields
      expect(messages).toContain('El email no puede estar vacío');
      expect(messages).toContain('El nombre no puede estar vacío');
      expect(messages).toContain('El apellido no puede estar vacío');
      expect(messages).toContain('La contraseña no puede estar vacía');
      expect(messages).toContain(
        'La confirmación de contraseña no puede estar vacía',
      );
    });

    it('When (2) email already exists -> throws "El correo ya está registrado"', async () => {
      const RegisterDto = require('./dto/register.dto').RegisterAuthDto;
      const dto = new RegisterDto();
      dto.email = 'exist@example.com';
      dto.firstName = 'Nombre';
      dto.lastName = 'Apellido';
      dto.password = 'Abc123';
      dto.confirmPassword = 'Abc123';

      mockUsersService.findByEmail.mockResolvedValue({
        id: 1,
        email: dto.email,
      });

      await expect(authService.register(dto)).rejects.toThrow(
        'El correo ya está registrado',
      );
      expect(mockLogsService.createFailureLog).toHaveBeenCalled();
    });

    it('When (3) invalid email format -> returns "Correo electrónico inválido"', async () => {
      const RegisterDto = require('./dto/register.dto').RegisterAuthDto;
      const dto = new RegisterDto();
      dto.email = 'bademail';
      dto.firstName = 'Nombre';
      dto.lastName = 'Apellido';
      dto.password = 'Abc123';
      dto.confirmPassword = 'Abc123';

      const errors = await validate(dto);
      const messages = errors.flatMap((e) =>
        e.constraints ? Object.values(e.constraints) : [],
      );
      expect(messages).toContain('Correo electrónico inválido');
    });

    it('When (4) password less than 6 chars -> returns "La contraseña debe tener al menos 6 caracteres"', async () => {
      const RegisterDto = require('./dto/register.dto').RegisterAuthDto;
      const dto = new RegisterDto();
      dto.email = 'user@example.com';
      dto.firstName = 'Nombre';
      dto.lastName = 'Apellido';
      dto.password = 'Ab1';
      dto.confirmPassword = 'Ab1';

      const errors = await validate(dto);
      const messages = errors.flatMap((e) =>
        e.constraints ? Object.values(e.constraints) : [],
      );
      expect(messages).toContain(
        'La contraseña debe tener al menos 6 caracteres',
      );
    });

    it('When (5) password missing uppercase/lowercase/number -> returns "La contraseña no cumple los requisitos de seguridad"', async () => {
      const RegisterDto = require('./dto/register.dto').RegisterAuthDto;
      const dto = new RegisterDto();
      dto.email = 'user@example.com';
      dto.firstName = 'Nombre';
      dto.lastName = 'Apellido';
      dto.password = 'abcdef';
      dto.confirmPassword = 'abcdef';

      const errors = await validate(dto);
      const messages = errors.flatMap((e) =>
        e.constraints ? Object.values(e.constraints) : [],
      );
      expect(messages).toContain(
        'La contraseña no cumple los requisitos de seguridad',
      );
    });

    it('When (6) password and confirmation different -> throws "Las contraseñas no coinciden"', async () => {
      const RegisterDto = require('./dto/register.dto').RegisterAuthDto;
      const dto = new RegisterDto();
      dto.email = 'new@example.com';
      dto.firstName = 'Nombre';
      dto.lastName = 'Apellido';
      dto.password = 'Abc123';
      dto.confirmPassword = 'Xyz123';

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(authService.register(dto)).rejects.toThrow(
        'Las contraseñas no coinciden',
      );
    });

    it('When (7) valid registration -> creates user', async () => {
      const RegisterDto = require('./dto/register.dto').RegisterAuthDto;
      const dto = new RegisterDto();
      dto.email = 'ok@example.com';
      dto.firstName = 'Nombre';
      dto.lastName = 'Apellido';
      dto.password = 'Abc123';
      dto.confirmPassword = 'Abc123';

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        id: 10,
        email: dto.email,
        password: 'hashed',
      });

      const result = await authService.register(dto as any);
      expect(result).toHaveProperty('email', dto.email);
      // password was hashed (bcrypt mocked to return 'hashed')
      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashed' }),
      );
      expect(mockLogsService.createSuccessLog).toHaveBeenCalledWith(
        'REGISTER_USER',
        10,
        expect.stringContaining(dto.email),
      );
    });
  });

  describe('Tokens, refresh and password-reset behavior', () => {
    it('logout returns a success message', () => {
      expect(authService.logout()).toEqual({
        message: 'Sesión cerrada correctamente',
      });
    });

    it('generateToken + getPayload produce/consume a token correctly', () => {
      const payload = { id: 1, role: Role.USER, email: 'a@b.com' };
      const token = authService.generateToken(payload, 'auth');

      const verified = authService.getPayload(token, 'auth');
      expect(verified).toMatchObject({
        id: 1,
        role: Role.USER,
        email: 'a@b.com',
      });
    });

    it('refreshToken throws on invalid token', async () => {
      await expect(authService.refreshToken('bad.token')).rejects.toThrow(
        'Token inválido o expirado',
      );
    });

    it('refreshToken throws when user from token does not exist', async () => {
      // do not include exp in payload when also using expiresIn option
      const token = jwt.sign(
        { email: 'missing@example.com' },
        config.refresh.secret,
        {
          expiresIn: '1h',
        },
      );
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(authService.refreshToken(token)).rejects.toThrow(
        'Token inválido o expirado',
      );
    });

    it('refreshToken returns both tokens when refresh is near expiry (<20 minutes)', async () => {
      const user = { id: 5, email: 'near@expiry.com', role: Role.USER };
      mockUsersService.findByEmail.mockResolvedValue(user);

      // create a refresh token that expires very soon (30 seconds)
      const shortToken = jwt.sign(
        { email: user.email },
        config.refresh.secret,
        {
          expiresIn: '30s',
        },
      );

      const res = await authService.refreshToken(shortToken);
      expect(res).toHaveProperty('accessToken');
      expect(res).toHaveProperty('refreshToken');
    });

    it('refreshToken returns only accessToken when refresh has enough life', async () => {
      const user = { id: 6, email: 'long@expiry.com', role: Role.USER };
      mockUsersService.findByEmail.mockResolvedValue(user);

      // use the real generator for a normal refresh token (config.refresh.expiresIn = 1d)
      const longToken = authService.generateToken(
        { email: user.email },
        'refresh',
      );

      const res = await authService.refreshToken(longToken);
      expect(res).toHaveProperty('accessToken');
      expect(res).not.toHaveProperty('refreshToken');
    });

    it('sendPasswordResetEmail does nothing when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      await expect(
        authService.sendPasswordResetEmail('noone@example.com'),
      ).resolves.toBeUndefined();
      expect(mockMailService.send).not.toHaveBeenCalled();
    });

    it('sendPasswordResetEmail sends mail when user exists', async () => {
      const user = { id: 9, email: 'send@me.com' };
      mockUsersService.findByEmail.mockResolvedValue(user);

      const sendSpy = mockMailService.send;
      sendSpy.mockResolvedValue(undefined);

      await authService.sendPasswordResetEmail(user.email);

      expect(sendSpy).toHaveBeenCalled();
      const callArg = sendSpy.mock.calls[0][0];
      expect(callArg).toHaveProperty('to', user.email);
      expect(callArg).toHaveProperty('subject', 'Recuperación de contraseña');
      expect(callArg.html).toContain('restablecer tu contraseña');
      expect(callArg.html).toContain('?token=');
    });

    it('validateToken returns valid true for a valid reset token and false for invalid', async () => {
      const token = jwt.sign({ email: 'x@y.com' }, config.reset.secret, {
        expiresIn: '1m',
      });

      const ok = await authService.validateToken(token);
      expect(ok).toEqual({ valid: true, email: 'x@y.com' });

      const bad = await authService.validateToken('invalid');
      expect(bad).toEqual({ valid: false });
    });

    it('getPayload throws when token invalid', () => {
      expect(() => authService.getPayload('invalid.token', 'auth')).toThrow();
    });
  });
});
