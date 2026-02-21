import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private genAI: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY');
    this.genAI = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async generateMotivation(userId: string): Promise<string> {
    try {
      const prompt = `
        User with ID ${userId} is currently behind schedule on their Islamic habits.
        Generate a short, powerful, and deeply inspiring motivational message in Indonesian 
        to encourage them to get back on track with their spiritual journey.
        The message should be about 2-3 sentences long and mention the importance of consistency in worship.
      `;
      const result = await this.genAI.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });
      return (
        result.text ||
        'Tetap semangat! Allah mencintai amalan yang konsisten meskipun sedikit.'
      );
    } catch (error) {
      console.error('Gemini API Error:', error);
      return 'Tetap semangat! Allah mencintai amalan yang konsisten meskipun sedikit.';
    }
  }
}
