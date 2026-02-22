import {
  Controller,
  Get,
  UseGuards,
  Request as Req,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
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
  async getMotivation(@Req() req: RequestWithUser) {
    return this.aiService.generateMotivation(req.user.sub);
  }

  @Sse('motivation/stream')
  getMotivationStream(
    @Req() req: RequestWithUser,
  ): Observable<MessageEvent> {
    const generator = this.aiService.generateMotivationStream(req.user.sub);

    return new Observable<MessageEvent>((subscriber) => {
      void (async () => {
        try {
          for await (const chunk of generator) {
            subscriber.next({ data: chunk } as MessageEvent);
          }
          subscriber.complete();
        } catch (err) {
          subscriber.error(err);
        }
      })();
    });
  }
}
