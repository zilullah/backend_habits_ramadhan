import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitPlan } from '../habits/habit-plan.entity.js';
import { PlansService } from '../habits/plans.service.js';
import { AiService } from '../ai/ai.service.js';
import { UpdateProgressDto } from './dto/update-progress.dto.js';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(HabitPlan)
    private readonly habitPlanRepository: Repository<HabitPlan>,
    private readonly plansService: PlansService,
    private readonly aiService: AiService,
  ) {}

  async updateProgress(updateProgressDto: UpdateProgressDto) {
    const { planId, actualValue } = updateProgressDto;

    const plan = await this.habitPlanRepository.findOne({
      where: { id: planId },
      relations: ['habit', 'habit.user'],
    });

    if (!plan) {
      throw new NotFoundException('Habit plan not found');
    }

    const isBehind = actualValue < plan.targetValue;
    plan.actualValue = actualValue;
    plan.isCompleted = actualValue >= plan.targetValue;

    await this.habitPlanRepository.save(plan);

    // Trigger recalculation for the entire habit
    await this.plansService.recalculatePlan(plan.habit.id);

    let motivation: string | null = null;
    if (isBehind) {
      motivation = await this.aiService.generateMotivation(plan.habit.user.id);
    }

    return {
      plan,
      motivation,
    };
  }
}
