import { Test, TestingModule } from '@nestjs/testing';
import { HabitsController } from './habits.controller.js';
import { HabitsService } from './habits.service.js';
import { CreateHabitDto } from './dto/create-habit.dto.js';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
  };
}

describe('HabitsController', () => {
  let controller: HabitsController;
  let mockHabitsService: Record<string, jest.Mock>;

  beforeEach(async () => {
    const internalMockHabitsService = {
      createHabit: jest.fn(),
      getTodayPlans: jest.fn(),
    };
    mockHabitsService = internalMockHabitsService as unknown as Record<
      string,
      jest.Mock
    >;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitsController],
      providers: [
        {
          provide: HabitsService,
          useValue: mockHabitsService,
        },
      ],
    }).compile();

    controller = module.get<HabitsController>(HabitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a habit', async () => {
      const dto: CreateHabitDto = {
        name: 'Quran',
        totalTarget: 30,
        targetUnit: 'Juz',
        durationDays: 30,
        startDate: '2026-02-22',
      };
      const user = { sub: 'user-id', email: 'test@example.com' };
      const req = { user } as unknown as RequestWithUser;
      const expectedResult = { id: 'habit-1', ...dto };
      mockHabitsService.createHabit.mockResolvedValue(expectedResult);

      const result = await controller.create(dto, req);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getToday', () => {
    it('should return today plans', async () => {
      const user = { sub: 'user-id', email: 'test@example.com' };
      const req = { user } as unknown as RequestWithUser;
      const expectedResult = [{ id: 'habit-1', name: 'Quran' }];
      mockHabitsService.getTodayPlans.mockResolvedValue(expectedResult);

      const result = await controller.getToday(req);
      expect(result).toEqual(expectedResult);
    });
  });
});
