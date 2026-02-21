import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { HabitPlan } from '../habits/habit-plan.entity';
import { PlansService } from '../habits/plans.service';
import { AiService } from '../ai/ai.service';

describe('ProgressService', () => {
  let service: ProgressService;
  let plansService: PlansService;
  let habitPlanRepo: any;

  const mockHabitPlanRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockPlansService = {
    recalculatePlan: jest.fn(),
  };

  const mockAiService = {
    generateMotivation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: getRepositoryToken(HabitPlan),
          useValue: mockHabitPlanRepo,
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
    habitPlanRepo = module.get(getRepositoryToken(HabitPlan));
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
      
      mockHabitPlanRepo.findOne.mockResolvedValue(plan);
      mockHabitPlanRepo.save.mockResolvedValue({ ...plan, actualValue: 5 });

      const result = await service.updateProgress(dto);

      expect(result.plan.actualValue).toBe(5);
      expect(habitPlanRepo.save).toHaveBeenCalled();
      expect(mockPlansService.recalculatePlan).toHaveBeenCalledWith('habit-1');
    });

    it('should trigger motivation if behind schedule', async () => {
      const dto = { planId: 'plan-1', actualValue: 2 }; // behind (target is 10)
      const plan = {
        id: 'plan-1',
        targetValue: 10,
        habit: { id: 'habit-1', user: { id: 'user-1' } },
      };

      const mockAiService = {
        generateMotivation: jest.fn().mockResolvedValue("Don't give up!"),
      };

      // We need to re-setup or just mock the injected aiService
      (service as any).aiService = mockAiService;

      mockHabitPlanRepo.findOne.mockResolvedValue(plan);
      mockHabitPlanRepo.save.mockResolvedValue({ ...plan, actualValue: 2 });

      const result = await service.updateProgress(dto);

      expect(result.motivation).toBe("Don't give up!");
      expect(mockAiService.generateMotivation).toHaveBeenCalledWith('user-1');
    });

    it('should throw NotFoundException if plan not found', async () => {
      mockHabitPlanRepo.findOne.mockResolvedValue(null);
      await expect(
        service.updateProgress({ planId: 'invalid', actualValue: 5 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
