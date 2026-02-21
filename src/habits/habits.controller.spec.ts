import { Test, TestingModule } from '@nestjs/testing';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';

describe('HabitsController', () => {
  let controller: HabitsController;
  let habitsService: HabitsService;

  const mockHabitsService = {
    createHabit: jest.fn(),
  };

  beforeEach(async () => {
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
    habitsService = module.get<HabitsService>(HabitsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a habit', async () => {
      const dto = {
        name: 'Khatam 30 Juz',
        totalTarget: 30,
        targetUnit: 'juz',
        durationDays: 30,
        startDate: '2023-01-01',
      };
      const req = { user: { sub: 'user-id' } };
      const result = { id: 'habit-id', ...dto, plans: [] };
      
      mockHabitsService.createHabit.mockResolvedValue(result);

      expect(await controller.create(dto, req)).toBe(result);
      expect(habitsService.createHabit).toHaveBeenCalledWith(dto, req.user);
    });
  });
});
