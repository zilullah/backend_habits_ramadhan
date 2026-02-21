import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('motivation')
  async getMotivation(@Request() req: any) {
    const userId = req.user.sub;
    const message = await this.aiService.generateMotivation(userId);
    return { motivation: message };
  }
}
