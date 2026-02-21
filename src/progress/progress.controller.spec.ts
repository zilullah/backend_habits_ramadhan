import { Test, TestingModule } from '@nestjs/testing';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

describe('ProgressController', () => {
  let controller: ProgressController;
  let progressService: ProgressService;

  const mockProgressService = {
    updateProgress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressController],
      providers: [
        {
          provide: ProgressService,
          useValue: mockProgressService,
        },
      ],
    }).compile();

    controller = module.get<ProgressController>(ProgressController);
    progressService = module.get<ProgressService>(ProgressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', () => {
    it('should update progress', async () => {
      const dto: UpdateProgressDto = {
        planId: 'plan-id',
        actualValue: 5,
      };
      const result = { id: 'plan-id', actualValue: 5, isCompleted: true };
      mockProgressService.updateProgress.mockResolvedValue(result);

      expect(await controller.update(dto)).toBe(result);
      expect(progressService.updateProgress).toHaveBeenCalledWith(dto);
    });
  });
});
