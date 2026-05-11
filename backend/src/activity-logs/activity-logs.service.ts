import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../shared/types/auth.types';
import { ActivityAction, ActivityEntity } from './types/activity-logs.types';

@Injectable()
export class ActivityLogsService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    user: AuthUser;
    entityType: ActivityEntity;
    entityId: number;
    action: ActivityAction;
  }) {
    if (!params.user?.id || !params.user?.organizationId) {
      throw new BadRequestException('Invalid user context for activity log');
    }

    if (!params.entityId || params.entityId <= 0) {
      throw new BadRequestException('Invalid entityId for activity log');
    }

    if (!params.entityType || !params.action) {
      throw new BadRequestException('Invalid activity log payload');
    }

    return this.prisma.activityLog.create({
      data: {
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        organizationId: params.user.organizationId,
        performedById: params.user.id,
      },
    });
  }

  async findAll(user: AuthUser, cursor?: number, limit = 10) {
    if (!user?.organizationId) {
      throw new BadRequestException('Invalid user context');
    }

    return this.prisma.activityLog.findMany({
      where: {
        organizationId: user.organizationId,
        ...(user.role !== 'ADMIN' && {
          performedById: user.id,
        }),
      },
      orderBy: { id: 'desc' },
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      include: {
        performedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
