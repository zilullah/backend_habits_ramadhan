import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      const result = { accessToken: 'access', refreshToken: 'refresh' };
      mockAuthService.register.mockResolvedValue(result);

      expect(await controller.register(dto)).toBe(result);
      expect(authService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = { accessToken: 'access', refreshToken: 'refresh' };
      mockAuthService.login.mockResolvedValue(result);

      expect(await controller.login(dto)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      const req = { user: { sub: 'user-id', refreshToken: 'old-refresh' } };
      const result = { accessToken: 'new-access', refreshToken: 'new-refresh' };
      mockAuthService.refreshTokens.mockResolvedValue(result);

      expect(await controller.refresh(req)).toBe(result);
      expect(authService.refreshTokens).toHaveBeenCalledWith('user-id', 'old-refresh');
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      const req = { user: { sub: 'user-id' } };
      mockAuthService.logout.mockResolvedValue(undefined);

      expect(await controller.logout(req)).toEqual({ message: 'Logged out successfully' });
      expect(authService.logout).toHaveBeenCalledWith('user-id');
    });
  });
});
