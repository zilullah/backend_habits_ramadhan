import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Habit } from './habit.entity.js';
import { PlansService } from './plans.service.js';
@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private habitRepository: Repository<Habit>,
    private plansService: PlansService,
  ) {}

  async createHabit(createHabitDto: DeepPartial<Habit>, user: { sub: string }) {
    const habit = this.habitRepository.create({
      ...createHabitDto,
      user: { id: user.sub },
    });

    const savedHabit = await this.habitRepository.save(habit);
    const plans = await this.plansService.generateInitialPlan(savedHabit);

    return {
      ...savedHabit,
      plans,
    };
  }

  async getTodayPlans(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    return this.habitRepository.find({
      where: {
        user: { id: userId },
        plans: { date: today as unknown as Date },
      },
      relations: ['plans'],
    });
  }
}
