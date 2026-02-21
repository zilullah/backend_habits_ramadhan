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

import { CreateHabitDto } from './dto/create-habit.dto';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get('today')
  async getToday(@Request() req: RequestWithUser) {
    return this.habitsService.getTodayPlans(req.user.sub);
  }

  @Post()
  async create(
    @Body() createHabitDto: CreateHabitDto,
    @Request() req: RequestWithUser,
  ) {
    // req.user comes from JwtAuthGuard/Strategy
    return this.habitsService.createHabit(createHabitDto, req.user);
  }
}
