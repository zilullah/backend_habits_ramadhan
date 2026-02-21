import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { User } from './users/user.entity.js';
import { HabitsModule } from './habits/habits.module.js';
import { Habit } from './habits/habit.entity.js';
import { HabitPlan } from './habits/habit-plan.entity.js';
import { ProgressModule } from './progress/progress.module.js';
import { AiModule } from './ai/ai.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [User, Habit, HabitPlan],
      synchronize: true, // Auto-create tables (disable in production)
    }),
    AuthModule,
    UsersModule,
    HabitsModule,
    ProgressModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
