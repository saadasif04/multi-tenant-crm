import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import type { AuthenticatedRequest } from '../shared/types/auth.types';

@UseGuards(JwtAuthGuard)
@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.activityLogsService.findAll(
      req.user,
      cursor ? Number(cursor) : undefined,
      limit ? Number(limit) : 10,
    );
  }
}
