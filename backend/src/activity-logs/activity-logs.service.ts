import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../shared/types/auth.types';

@Injectable()
export class ActivityLogsService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    user: AuthUser;
    entityType: string;
    entityId: number;
    action: string;
  }) {
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

  async findAll(user: AuthUser) {
    return this.prisma.activityLog.findMany({
      where: {
        organizationId: user.organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        performedBy: true,
      },
    });
  }
}
