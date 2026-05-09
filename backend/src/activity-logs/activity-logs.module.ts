import { Module } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ActivityLogsService, PrismaService],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
