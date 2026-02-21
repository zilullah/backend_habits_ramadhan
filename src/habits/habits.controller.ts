import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { HabitsService } from './habits.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get('today')
  async getToday(@Request() req: any) {
    return this.habitsService.getTodayPlans(req.user.sub);
  }

  @Post()
  async create(@Body() createHabitDto: any, @Request() req: any) {
    // req.user comes from JwtAuthGuard/Strategy
    return this.habitsService.createHabit(createHabitDto, req.user);
  }
}
