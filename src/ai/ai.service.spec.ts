import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { Habit } from '../habits/habit.entity';
import { HabitPlan } from '../habits/habit-plan.entity';

describe('AiService', () => {
  let service: AiService;
  let habitRepo: any;

  const mockHabitRepo = {
    find: jest.fn(),
  };

  const mockHabitPlanRepo = {
    // Basic mock for now
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'GOOGLE_AI_API_KEY') return 'mock-api-key';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(Habit),
          useValue: mockHabitRepo,
        },
        {
          provide: getRepositoryToken(HabitPlan),
          useValue: mockHabitPlanRepo,
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    habitRepo = module.get(getRepositoryToken(Habit));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateMotivation', () => {
    it('should return a message if user has no habits', async () => {
      mockHabitRepo.find.mockResolvedValue([]);
      const result = await service.generateMotivation('user-id');
      expect(result).toContain('Start creating some habits');
    });

    // Mocking GoogleGenerativeAI is complex due to its structure. 
    // For now, we verify the logic up to the AI call or use a simplified mock if needed.
    // Given the complexity of mocking the Gemini SDK classes, we focus on the data fetching part.
  });
});
