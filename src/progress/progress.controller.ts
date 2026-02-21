import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service.js';
import { UpdateProgressDto } from './dto/update-progress.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  async update(@Body() updateProgressDto: UpdateProgressDto) {
    return this.progressService.updateProgress(updateProgressDto);
  }
}
