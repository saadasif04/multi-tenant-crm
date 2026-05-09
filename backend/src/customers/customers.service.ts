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
        assignedToId: user.id,
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
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;

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
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
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
}
