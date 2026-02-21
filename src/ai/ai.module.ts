import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service.js';
import { AiController } from './ai.controller.js';
import { Habit } from '../habits/habit.entity.js';
import { HabitPlan } from '../habits/habit-plan.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habit, HabitPlan]),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
