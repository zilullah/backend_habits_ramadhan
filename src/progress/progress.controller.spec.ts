import { Test, TestingModule } from '@nestjs/testing';
import { ProgressController } from './progress.controller.js';
import { ProgressService } from './progress.service.js';
import { UpdateProgressDto } from './dto/update-progress.dto.js';

describe('ProgressController', () => {
  let controller: ProgressController;
  let mockProgressService: Record<string, jest.Mock>;

  const internalMockProgressService = {
    updateProgress: jest.fn(),
  };

  beforeEach(async () => {
    mockProgressService = internalMockProgressService as unknown as Record<
      string,
      jest.Mock
    >;

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

      const response = await controller.update(dto);
      expect(response).toBe(result);
      expect(mockProgressService.updateProgress).toHaveBeenCalledWith(dto);
    });
  });
});
