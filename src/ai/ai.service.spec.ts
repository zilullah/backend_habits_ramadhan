import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service.js';

jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: 'Mocked motivation message',
          }),
        },
      };
    }),
  };
});

describe('AiService', () => {
  let service: AiService;

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
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateMotivation', () => {
    it('should return a mocked motivation message', async () => {
      const result = await service.generateMotivation('user-id');
      expect(result).toBe('Mocked motivation message');
    });

    it('should return a fallback message if Gemini API fails', async () => {
      // Mock console.error to avoid cluttering test output
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Re-mock to throw error for this specific test
      const { GoogleGenAI } = jest.requireMock('@google/genai');
      (GoogleGenAI as jest.Mock).mockImplementationOnce(() => ({
        models: {
          generateContent: jest.fn().mockRejectedValue(new Error('API Error')),
        },
      }));

      // Re-create module and service to ensure the new mock is used in constructor
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AiService,
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
        ],
      }).compile();
      const localService = module.get<AiService>(AiService);

      const result = await localService.generateMotivation('user-id');
      expect(result).toContain('Tetap semangat!');

      // Verify console.error was called and restore it
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
