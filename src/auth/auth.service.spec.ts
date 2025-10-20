import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { RegisterAuthDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';
import { Role } from '../common/enums/roles.enums';
import { MailService } from '../common/mail.service';

class MockMailService {
  sendMail() {
    return true;
  }
}

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsuarioService;
  let users: any[] = [];

  const mockUsuarioService = {
    create: jest.fn(async (dto) => {
      const user = { id: users.length + 1, ...dto };
      users.push(user);
      return user;
    }),
    findByEmail: jest.fn(async (email) => users.find((u) => u.email === email)),
    findByEmailWithPassword: jest.fn(async (email) =>
      users.find((u) => u.email === email),
    ),
  };

  beforeEach(async () => {

    users = [];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuarioService,
          useValue: mockUsuarioService,
        },
        { 
          provide: MailService, 
          useClass: MockMailService 
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    const dto: RegisterAuthDto = {
      email: 'test@example.com',
      name: 'John',
      lastname: 'Doe',
      password: '123456',
      role: Role.USER,
    };

    const user = await service.register(dto);

    expect(user).toHaveProperty('id');
    expect(user.email).toBe(dto.email);
    expect(user.name).toBe(dto.name);
    expect(user.lastname).toBe(dto.lastname);
    expect(user).not.toHaveProperty('password');
  });

  it('should throw if email already exists', async () => {
    const dto: RegisterAuthDto = {
      email: 'test2@example.com',
      name: 'Jane',
      lastname: 'Smith',
      password: 'abcdef',
      role: Role.USER,
    };

    await service.register(dto);

    await expect(service.register(dto)).rejects.toThrow('El usuario ya existe');
  });

  it('should login a user and return tokens', async () => {
    const registerDto: RegisterAuthDto = {
      email: 'login@example.com',
      name: 'Alice',
      lastname: 'Wonder',
      password: 'password123',
      role: Role.USER,
    };

    await service.register(registerDto);

    const loginDto: LoginAuthDto = {
      email: 'login@example.com',
      password: 'password123',
    };

    const tokens = await service.login(loginDto);

    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
    expect(typeof tokens.accessToken).toBe('string');
    expect(typeof tokens.refreshToken).toBe('string');
  });

  it('should throw if login with wrong password', async () => {
    const dto: RegisterAuthDto = {
      email: 'wrongpass@example.com',
      name: 'Bob',
      lastname: 'Builder',
      password: 'builder123',
      role: Role.USER,
    };

    await service.register(dto);

    const loginDto: LoginAuthDto = {
      email: 'wrongpass@example.com',
      password: 'wrongpassword',
    };

    await expect(service.login(loginDto)).rejects.toThrow('Contraseña incorrecta');
  });

  it('should refresh access token', async () => {
    const dto: RegisterAuthDto = {
      email: 'refresh@example.com',
      name: 'Refresh',
      lastname: 'Token',
      password: 'refresh123',
      role: Role.USER,
    };

    const user = await service.register(dto);

    const loginDto: LoginAuthDto = { email: dto.email, password: dto.password };
    const tokens = await service.login(loginDto);

    const newTokens = service.refreshToken(tokens.refreshToken);

    expect(newTokens).toHaveProperty('accessToken');
  });
});