import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Habit } from '../habits/habit.entity.js';
import { HabitPlan } from '../habits/habit-plan.entity.js';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
    @InjectRepository(HabitPlan)
    private readonly habitPlanRepository: Repository<HabitPlan>,
  ) {
    const apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async generateMotivation(userId: string): Promise<string> {
    if (!this.genAI) {
      return "Keep going! You're doing great on your habits.";
    }

    try {
      // 1. Fetch user habits and plans
      const habits = await this.habitRepository.find({
        where: { user: { id: userId } },
        relations: ['plans'],
      });

      if (habits.length === 0) {
        return "Start creating some habits to get personalized motivation!";
      }

      // 2. Format progress for the prompt
      let progressSummary = "Here is the current progress for my habits:\n";
      habits.forEach(habit => {
        const totalActual = habit.plans.reduce((sum, p) => sum + (p.actualValue || 0), 0);
        const percent = Math.round((totalActual / habit.totalTarget) * 100);
        progressSummary += `- ${habit.name}: ${totalActual}/${habit.totalTarget} ${habit.targetUnit} (${percent}% complete)\n`;
      });

      // 3. Call Gemini
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `
        You are a supportive and wise habit coach. 
        A user is tracking their habits and needs motivation. 
        ${progressSummary}
        
        Please provide a short, impactful, and personalized motivation message in Indonesian. 
        Avoid sounding generic. Mention specific habits if they are doing well or need a boost.
        Keep it under 3 paragraphs.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new InternalServerErrorException('Failed to generate motivation');
    }
  }
}
