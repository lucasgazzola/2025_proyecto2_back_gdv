import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { MailService } from '../common/mail.service';
import { UsuarioRepository } from '../usuario/usuario.repository';

class MockMailService {
  sendMail() {
    return true;
  }
}

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService, 
        UsuarioService,
        { 
          provide: MailService, 
          useClass: MockMailService 
        },
        UsuarioRepository
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
