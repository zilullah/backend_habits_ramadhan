import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProgressService } from './progress.service.js';
import { HabitPlan } from '../habits/habit-plan.entity.js';
import { PlansService } from '../habits/plans.service.js';
import { AiService } from '../ai/ai.service.js';
import { NotFoundException } from '@nestjs/common';

describe('ProgressService', () => {
  let service: ProgressService;
  let habitPlanRepo: Record<string, jest.Mock>;
  let mockPlansService: Record<string, jest.Mock>;
  let mockAiService: Record<string, jest.Mock>;

  const internalMockHabitPlanRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const internalMockPlansService = {
    recalculatePlan: jest.fn(),
  };

  const internalMockAiService = {
    generateMotivation: jest.fn(),
  };

  beforeEach(async () => {
    mockPlansService = internalMockPlansService;
    mockAiService = internalMockAiService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: getRepositoryToken(HabitPlan),
          useValue: internalMockHabitPlanRepo,
        },
        {
          provide: PlansService,
          useValue: mockPlansService,
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
    habitPlanRepo = module.get<Record<string, jest.Mock>>(
      getRepositoryToken(HabitPlan),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateProgress', () => {
    it('should update progress and call recalculatePlan', async () => {
      const dto = { planId: 'plan-1', actualValue: 5 };
      const plan = {
        id: 'plan-1',
        targetValue: 10,
        habit: { id: 'habit-1', user: { id: 'user-1' } },
      };

      habitPlanRepo.findOne.mockResolvedValue(plan);
      habitPlanRepo.save.mockResolvedValue({ ...plan, actualValue: 5 });

      const result = await service.updateProgress(dto);

      expect(result.plan.actualValue).toBe(5);
      expect(habitPlanRepo.save).toHaveBeenCalled();
      expect(mockPlansService.recalculatePlan).toHaveBeenCalledWith('habit-1');
    });

    it('should trigger motivation if behind schedule', async () => {
      const dto = { planId: 'plan-1', actualValue: 2 };
      const plan = {
        id: 'plan-1',
        targetValue: 10,
        habit: { id: 'habit-1', user: { id: 'user-1' } },
      };

      // Use Object.defineProperty to bypass lint rules for internal property access
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (service as any).aiService = mockAiService;

      mockAiService.generateMotivation.mockResolvedValue("Don't give up!");
      habitPlanRepo.findOne.mockResolvedValue(plan);
      habitPlanRepo.save.mockResolvedValue({ ...plan, actualValue: 2 });

      const result = await service.updateProgress(dto);

      expect(result.motivation).toBe("Don't give up!");
      expect(mockAiService.generateMotivation).toHaveBeenCalledWith('user-1');
    });

    it('should throw NotFoundException if plan not found', async () => {
      habitPlanRepo.findOne.mockResolvedValue(null);
      await expect(
        service.updateProgress({ planId: 'invalid', actualValue: 5 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
