import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';

describe('AiController', () => {
  let controller: AiController;
  let mockAiService: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockAiService = {
      generateMotivation: jest.fn(),
    } as Record<string, jest.Mock>;

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMotivation', () => {
    it('should return motivation message', async () => {
      const motivation = 'Motivation message';
      mockAiService.generateMotivation.mockResolvedValue(motivation);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const result = await controller.getMotivation({
        user: { sub: 'user-id' },
      } as any);
      expect(result).toBe(motivation);
      expect(mockAiService.generateMotivation).toHaveBeenCalledWith('user-id');
    });
  });
});
