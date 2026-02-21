import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './habit.entity.js';
import { HabitPlan } from './habit-plan.entity.js';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(HabitPlan)
    private habitPlanRepository: Repository<HabitPlan>,
  ) {}

  async generateInitialPlan(habit: Habit): Promise<HabitPlan[]> {
    const plans: HabitPlan[] = [];
    const dailyTarget = habit.totalTarget / habit.durationDays;
    const startDate = new Date(habit.startDate);

    for (let i = 0; i < habit.durationDays; i++) {
      const planDate = new Date(startDate);
      planDate.setDate(startDate.getDate() + i);

      const plan = this.habitPlanRepository.create({
        date: planDate,
        targetValue: parseFloat(dailyTarget.toFixed(2)),
        habit: habit,
      });
      plans.push(plan);
    }

    return this.habitPlanRepository.save(plans);
  }

  async recalculatePlan(habitId: string): Promise<void> {
    const habit = await this.habitPlanRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.habit', 'habit')
      .where('habit.id = :habitId', { habitId })
      .getMany();

    if (!habit || habit.length === 0) return;

    const actualHabit = habit[0].habit;
    const allPlans = await this.habitPlanRepository.find({
      where: { habit: { id: habitId } },
      order: { date: 'ASC' },
    });

    const totalProgress = allPlans.reduce(
      (sum, p) => sum + (p.actualValue || 0),
      0,
    );
    const remainingTarget = Math.max(
      0,
      actualHabit.totalTarget - totalProgress,
    );

    const todayStr = new Date().toISOString().split('T')[0];
    const futurePlans = allPlans.filter((p) => {
      const pDateStr = new Date(p.date).toISOString().split('T')[0];
      return pDateStr > todayStr;
    });

    if (futurePlans.length > 0) {
      const dailyTarget = remainingTarget / futurePlans.length;
      futurePlans.forEach((p) => {
        p.targetValue = parseFloat(dailyTarget.toFixed(2));
      });
      await this.habitPlanRepository.save(futurePlans);
    }
  }
}
