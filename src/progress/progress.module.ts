import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitPlan } from '../habits/habit-plan.entity.js';
import { HabitsModule } from '../habits/habits.module.js';
import { AiModule } from '../ai/ai.module.js';
import { ProgressService } from './progress.service.js';
import { ProgressController } from './progress.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([HabitPlan]),
    HabitsModule, // To access PlansService
    AiModule, // To access AiService
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
