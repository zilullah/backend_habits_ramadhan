import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('motivation')
  async getMotivation(@Request() req: RequestWithUser) {
    return this.aiService.generateMotivation(req.user.sub);
  }
}
