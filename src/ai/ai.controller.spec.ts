import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('AiController', () => {
  let controller: AiController;
  let aiService: AiService;

  const mockAiService = {
    generateMotivation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: AiService,
          useValue: mockAiService,
        },
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
    aiService = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMotivation', () => {
    it('should return motivation message', async () => {
      const req = { user: { sub: 'user-id' } };
      const motivation = 'Keep going!';
      mockAiService.generateMotivation.mockResolvedValue(motivation);

      const result = await controller.getMotivation(req);
      expect(result).toEqual({ motivation });
      expect(aiService.generateMotivation).toHaveBeenCalledWith('user-id');
    });
  });
});
