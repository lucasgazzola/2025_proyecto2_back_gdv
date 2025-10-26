import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { validate } from 'class-validator';
import { LoginAuthDto } from './dto/login.dto';

// Simple mocks for AuthService methods used by the controller
const mockAuthService: any = {
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  refreshToken: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  validateToken: jest.fn(),
};

describe('AuthController (unit)', () => {
  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(mockAuthService as unknown as AuthService);
  });

  describe('DTO validation (class-validator)', () => {
    it('Login DTO: email empty -> El email no puede estar vacío', async () => {
      const dto = new LoginAuthDto();
      dto.email = '';
      dto.password = 'validpass';

      const errors = await validate(dto);
      const messages = errors.flatMap((e) =>
        e.constraints ? Object.values(e.constraints) : [],
      );
      expect(messages).toContain('El email no puede estar vacío');
    });

    it('Login DTO: invalid email format -> El formato del email no es válido', async () => {
      const dto = new LoginAuthDto();
      dto.email = 'bademail';
      dto.password = 'validpass';

      const errors = await validate(dto);
      const messages = errors.flatMap((e) =>
        e.constraints ? Object.values(e.constraints) : [],
      );
      expect(messages).toContain('El formato del email no es válido');
    });
  });

  describe('Controller methods', () => {
    it('register -> delega a authService.register y devuelve resultado', async () => {
      const dto: any = { email: 'a@b.com' };
      mockAuthService.register.mockResolvedValue({ id: 1, email: dto.email });

      const res = await controller.register(dto);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(res).toEqual({ id: 1, email: dto.email });
    });

    it('login -> delega a authService.login y devuelve tokens', async () => {
      const dto: any = { email: 'a@b.com', password: 'pass' };
      const tokens = { accessToken: 'x', refreshToken: 'y' };
      mockAuthService.login.mockResolvedValue(tokens);

      const res = await controller.login(dto);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(res).toEqual(tokens);
    });

    it('logout -> delega a authService.logout', () => {
      mockAuthService.logout.mockReturnValue('ok');
      const res = controller.logout();
      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(res).toBe('ok');
    });

    it('refresh -> delega a authService.refreshToken con el token', async () => {
      mockAuthService.refreshToken.mockResolvedValue({ accessToken: 'z' });
      const res = await controller.refresh('refresh-token');
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(
        'refresh-token',
      );
      expect(res).toEqual({ accessToken: 'z' });
    });

    it('forgot-password -> delega a authService.sendPasswordResetEmail', async () => {
      mockAuthService.sendPasswordResetEmail.mockResolvedValue(true);
      const res = await controller.forgotPassword('u@e.com');
      expect(mockAuthService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'u@e.com',
      );
      expect(res).toBe(true);
    });

    it('validate-token -> delega a authService.validateToken', async () => {
      mockAuthService.validateToken.mockResolvedValue({ valid: true });
      const res = await controller.validateToken('tok');
      expect(mockAuthService.validateToken).toHaveBeenCalledWith('tok');
      expect(res).toEqual({ valid: true });
    });
  });
});
