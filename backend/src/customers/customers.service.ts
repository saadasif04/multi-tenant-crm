import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { AuthUser } from '../shared/types/auth.types';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ActivityAction } from '../activity-logs/types/activity-logs.types';

@Injectable()
export class CustomersService {
  constructor(
    private prisma: PrismaService,
    private activityLogsService: ActivityLogsService,
  ) {}

  // CREATE
  async create(user: AuthUser, dto: CreateCustomerDto) {
    const customer = await this.prisma.customer.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        organizationId: user.organizationId,
        assignedToId: null,
        createdById: user.id,
      },
    });

    await this.activityLogsService.log({
      user,
      entityType: 'CUSTOMER',
      entityId: customer.id,
      action: ActivityAction.CREATED,
    });

    return customer;
  }

  // GET ALL (pagination + search + soft delete filter)
  async findAll(user: AuthUser, query: QueryCustomerDto) {
    const limit = query.limit ?? 10;

    return this.prisma.customer.findMany({
      where: {
        organizationId: user.organizationId,
        deletedAt: null,
        OR: query.search
          ? [
              { name: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      take: limit,
      ...(query.cursor && {
        skip: 1,
        cursor: { id: Number(query.cursor) },
      }),
      orderBy: { id: 'desc' },
    });
  }

  // UPDATE
  async update(user: AuthUser, id: number, dto: CreateCustomerDto) {
    const customer = await this.prisma.customer.update({
      where: {
        id,
        organizationId: user.organizationId,
      },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
      },
    });

    await this.activityLogsService.log({
      user,
      entityType: 'CUSTOMER',
      entityId: id,
      action: ActivityAction.UPDATED,
    });

    return customer;
  }

  // SOFT DELETE
  async remove(user: AuthUser, id: number) {
    const customer = await this.prisma.customer.update({
      where: {
        id,
        organizationId: user.organizationId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    await this.activityLogsService.log({
      user,
      entityType: 'CUSTOMER',
      entityId: id,
      action: ActivityAction.DELETED,
    });

    return customer;
  }

  // RESTORE
  async restore(user: AuthUser, id: number) {
    const customer = await this.prisma.customer.update({
      where: {
        id,
        organizationId: user.organizationId,
      },
      data: {
        deletedAt: null,
      },
    });

    await this.activityLogsService.log({
      user,
      entityType: 'CUSTOMER',
      entityId: id,
      action: ActivityAction.RESTORED,
    });

    return customer;
  }

  async assignCustomer(
    user: AuthUser,
    customerId: number,
    assignedToId: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Count active customers for target user
      const activeCount = await tx.customer.count({
        where: {
          assignedToId,
          deletedAt: null,
        },
      });

      // 2. Enforce limit
      if (activeCount >= 5) {
        throw new Error('User already has maximum 5 active customers');
      }

      // 3. Update assignment
      const customer = await tx.customer.update({
        where: {
          id: customerId,
          organizationId: user.organizationId,
        },
        data: {
          assignedToId,
        },
      });

      // 4. Log activity
      await tx.activityLog.create({
        data: {
          entityType: 'CUSTOMER',
          entityId: customerId,
          action: ActivityAction.ASSIGNED,
          organizationId: user.organizationId,
          performedById: user.id,
        },
      });

      return customer;
    });
  }
}
