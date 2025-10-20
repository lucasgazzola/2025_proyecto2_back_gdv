import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from  './usuario.service';
import { CreateUsuarioDto } from  './dto/create-usuario.dto';
import { Role } from '../common/enums/roles.enums';
import { UsuarioRepository } from './usuario.repository';

describe('UsersService', () => {
  let service: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioService, UsuarioRepository],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUsuarioDto = {
      email: 'test@example.com',
      name: 'John',
      lastname: 'Doe',
      password: '123456',
      role: Role.USER,
    };

    const user = await service.create(dto);

    expect(user).toHaveProperty('id');
    expect(user.email).toBe(dto.email);
    // expect(user.password).not.toBe(dto.password); // password debe estar hasheada
  });

  it('should return all users', async () => {
    const dto: CreateUsuarioDto = {
      email: 'test2@example.com',
      name: 'Jane',
      lastname: 'Smith',
      password: 'abcdef',
      role: Role.USER,
    };

    await service.create(dto);
    const users = service.findAll();

    expect(users.length).toBe(1);
    expect(users[0].email).toBe(dto.email);
  });

  it('should find a user by id', async () => {
    const dto: CreateUsuarioDto = {
      email: 'findme@example.com',
      name: 'Alice',
      lastname: 'Wonder',
      password: 'pass123',
      role: Role.USER,
    };

    const created = await service.create(dto);
    const found = service.findOne(created.id);

    expect(found.id).toBe(created.id);
    expect(found.email).toBe(dto.email);
  });

  it('should update a user', async () => {
    const dto: CreateUsuarioDto = {
      email: 'update@example.com',
      name: 'Bob',
      lastname: 'Builder',
      password: 'builder123',
      role: Role.USER,
    };

    const created = await service.create(dto);

    const updated = await service.update(created.id, { name: 'Bobby' });

    expect(updated.name).toBe('Bobby');
    expect(updated.email).toBe(dto.email);
  });

  it('should remove a user', async () => {
    const dto: CreateUsuarioDto = {
      email: 'delete@example.com',
      name: 'Delete',
      lastname: 'Me',
      password: 'delete123',
      role: Role.USER,
    };

    const created = await service.create(dto);

    service.remove(created.id);

    expect(() => service.findOne(created.id)).toThrow();
  });
});
