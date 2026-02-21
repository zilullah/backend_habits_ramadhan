import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './habit.entity.js';
import { HabitPlan } from './habit-plan.entity.js';
import { HabitsService } from './habits.service.js';
import { HabitsController } from './habits.controller.js';
import { PlansService } from './plans.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, HabitPlan])],
  controllers: [HabitsController],
  providers: [HabitsService, PlansService],
  exports: [PlansService, TypeOrmModule],
})
export class HabitsModule {}
