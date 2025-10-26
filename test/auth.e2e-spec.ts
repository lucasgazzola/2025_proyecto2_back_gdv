import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import request from 'supertest';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';

describe('Auth - Login (e2e unit)', () => {
  let app: INestApplication;

  const mockAuthService = {
    login: jest.fn((dto) => {
      // Simulate invalid credentials
      if (dto.email === 'valid@example.com' && dto.password === 'correctpass') {
        return { accessToken: 'token', refreshToken: 'refresh' };
      }
      // For any other valid-form email, return Unauthorized
      throw new UnauthorizedException('Credenciales inválidas');
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Register the same global ValidationPipe configuration as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('When (1) email empty -> returns message "El email no puede estar vacío"', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: '', password: 'validpass' })
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(Array.isArray(res.body.message)).toBeTruthy();
    expect(res.body.message).toContain('El email no puede estar vacío');
  });

  it('When (2) password empty -> returns message "La contraseña no puede estar vacía"', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@example.com', password: '' })
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(Array.isArray(res.body.message)).toBeTruthy();
    expect(res.body.message).toContain('La contraseña no puede estar vacía');
  });

  it('When (3) invalid email format -> returns message "El formato del email no es válido"', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'usuario@correo', password: 'validpass' })
      .expect(400);

    expect(res.body).toHaveProperty('message');
    expect(Array.isArray(res.body.message)).toBeTruthy();
    expect(res.body.message).toContain('El formato del email no es válido');
  });

  it('When (4) valid format but incorrect credentials -> returns 401 Credenciales inválidas', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'valid@example.com', password: 'wrongpass' })
      .expect(401);

    expect(res.body).toHaveProperty('message', 'Credenciales inválidas');
  });

  it('When (5) valid credentials -> returns 200 and tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'valid@example.com', password: 'correctpass' })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });
});
