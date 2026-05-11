import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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

  // CREATE — with 5-customer limit + race condition prevention
  async create(user: AuthUser, dto: CreateCustomerDto) {
    const customer = await this.prisma.$transaction(async (tx) => {
      // 1. LOCK all customers assigned to this user
      await tx.$queryRaw`
        SELECT id
        FROM "Customer"
        WHERE "assignedToId" = ${user.id}
        FOR UPDATE
      `;

      // 2. Count check
      const activeCount = await tx.customer.count({
        where: {
          assignedToId: user.id,
          deletedAt: null,
        },
      });

      if (activeCount >= 5) {
        throw new BadRequestException(
          'You already have the maximum of 5 active customers assigned',
        );
      }

      // 3. Create and auto-assign to creator
      return tx.customer.create({
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          organizationId: user.organizationId,
          assignedToId: user.id,
          createdById: user.id,
        },
      });
    });

    // LOG: created
    try {
      await this.activityLogsService.log({
        user,
        entityType: 'CUSTOMER',
        entityId: customer.id,
        action: ActivityAction.CREATED,
      });
    } catch (err) {
      console.error('Activity log failed:', err);
    }

    // LOG: auto-assigned on creation
    try {
      await this.activityLogsService.log({
        user,
        entityType: 'CUSTOMER',
        entityId: customer.id,
        action: ActivityAction.ASSIGNED,
      });
    } catch (err) {
      console.error('Activity log failed:', err);
    }

    return customer;
  }

  // GET ALL (cursor pagination)
  async findAll(user: AuthUser, query: QueryCustomerDto) {
  const limit = query.limit ? Number(query.limit) : 10;

  return this.prisma.customer.findMany({
    where: {
      organizationId: user.organizationId,

      // ADMIN: sees all active or all deleted based on toggle
      // MEMBER: always sees only their own (active or deleted)
      ...(user.role === 'ADMIN'
        ? {
            deletedAt: query.showDeleted ? { not: null } : null,
          }
        : {
            createdById: user.id,
            deletedAt: query.showDeleted ? { not: null } : null,
          }),

      OR: query.search
        ? [
            { name: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
          ]
        : undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      assignedToId: true,
      deletedAt: true,
      assignedTo: {
        select: {
          id: true,
          name: true,
        },
      },
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
    const existing = await this.prisma.customer.findFirst({
      where: {
        id,
        organizationId: user.organizationId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new NotFoundException('Customer not found');
    }

    const updated = await this.prisma.customer.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
      },
    });

    try {
      await this.activityLogsService.log({
        user,
        entityType: 'CUSTOMER',
        entityId: id,
        action: ActivityAction.UPDATED,
      });
    } catch (err) {
      console.error('Activity log failed:', err);
    }

    return updated;
  }

  // SOFT DELETE — clears assignedToId
  // SOFT DELETE
async remove(user: AuthUser, id: number) {
  const existing = await this.prisma.customer.findFirst({
    where: {
      id,
      organizationId: user.organizationId,
      deletedAt: null,
      // MEMBER: can only delete their own assigned customers
      ...(user.role !== 'ADMIN' && {
        assignedToId: user.id,
      }),
    },
  });

  if (!existing) {
    throw new NotFoundException('Customer not found');
  }

  const deleted = await this.prisma.customer.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      assignedToId: null,
    },
  });

  try {
    await this.activityLogsService.log({
      user,
      entityType: 'CUSTOMER',
      entityId: id,
      action: ActivityAction.DELETED,
    });
  } catch (err) {
    console.error('Activity log failed:', err);
  }

  return deleted;
}

  // RESTORE
  // RESTORE
async restore(user: AuthUser, id: number) {
  const existing = await this.prisma.customer.findFirst({
    where: {
      id,
      organizationId: user.organizationId,
      // MEMBER: can only restore customers they originally had
      ...(user.role !== 'ADMIN' && {
        createdById: user.id,
      }),
    },
  });

  if (!existing) {
    throw new NotFoundException('Customer not found');
  }

  const restored = await this.prisma.customer.update({
    where: { id },
    data: { deletedAt: null },
  });

  try {
    await this.activityLogsService.log({
      user,
      entityType: 'CUSTOMER',
      entityId: id,
      action: ActivityAction.RESTORED,
    });
  } catch (err) {
    console.error('Activity log failed:', err);
  }

  return restored;
}

  // ASSIGN CUSTOMER — fully race-safe, untouched
  async assignCustomer(
    user: AuthUser,
    customerId: number,
    assignedToId: number,
  ) {
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. LOCK all customers of this user
      await tx.$queryRaw`
        SELECT id
        FROM "Customer"
        WHERE "assignedToId" = ${assignedToId}
        FOR UPDATE
      `;

      // 2. Count check
      const activeCount = await tx.customer.count({
        where: {
          assignedToId,
          deletedAt: null,
        },
      });

      if (activeCount >= 5) {
        throw new BadRequestException(
          'User already has maximum 5 active customers',
        );
      }

      // 3. Assign
      return tx.customer.update({
        where: { id: customerId },
        data: { assignedToId },
      });
    });

    // LOG: assigned
    try {
      await this.activityLogsService.log({
        user,
        entityType: 'CUSTOMER',
        entityId: customerId,
        action: ActivityAction.ASSIGNED,
      });
    } catch (err) {
      console.error('Activity log failed:', err);
    }

    return result;
  }
}