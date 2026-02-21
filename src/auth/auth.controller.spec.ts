import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
    } as Record<string, jest.Mock>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test',
      };
      const tokens = { accessToken: 'at', refreshToken: 'rt' };
      mockAuthService.register.mockResolvedValue(tokens);

      const result = await controller.register(dto);
      expect(result).toBe(tokens);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const dto = { email: 'test@example.com', password: 'password' };
      const tokens = { accessToken: 'at', refreshToken: 'rt' };
      mockAuthService.login.mockResolvedValue(tokens);

      const result = await controller.login(dto);
      expect(result).toBe(tokens);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      const tokens = { accessToken: 'at2', refreshToken: 'rt2' };
      mockAuthService.refreshTokens.mockResolvedValue(tokens);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await controller.refresh({
        user: { sub: 'user-id', refreshToken: 'old-refresh' },
      } as any);
      expect(result).toBe(tokens);
      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(
        'user-id',
        'old-refresh',
      );
    });
  });

  describe('logout', () => {
    it('should logout a user', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await controller.logout({
        user: { sub: 'user-id' },
      } as any);
      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockAuthService.logout).toHaveBeenCalledWith('user-id');
    });
  });
});
