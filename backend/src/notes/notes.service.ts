import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthUser } from '../shared/types/auth.types';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ActivityAction } from '../activity-logs/types/activity-logs.types';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private activityLogsService: ActivityLogsService,
  ) {}

  // CREATE NOTE
  async create(user: AuthUser, dto: CreateNoteDto) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        id: dto.customerId,
        organizationId: user.organizationId,
        // MEMBER: can only add notes to their assigned customers
        ...(user.role !== 'ADMIN' && {
          assignedToId: user.id,
        }),
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (customer.deletedAt) {
      throw new BadRequestException('Cannot add note to deleted customer');
    }

    const note = await this.prisma.note.create({
      data: {
        content: dto.content,
        customerId: dto.customerId,
        organizationId: user.organizationId,
        createdById: user.id,
      },
    });

    try {
      await this.activityLogsService.log({
        user,
        entityType: 'NOTE',
        entityId: note.id,
        action: ActivityAction.CREATED,
      });
    } catch (err) {
      console.error('Activity log failed:', err);
    }

    return note;
  }

  // GET ALL NOTES (org-wide)
  async findAll(user: AuthUser) {
    return this.prisma.note.findMany({
      where: {
        organizationId: user.organizationId,
        // MEMBER: only their own notes
        ...(user.role !== 'ADMIN' && {
          createdById: user.id,
        }),
      },
      include: {
        customer: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

// GET NOTES FOR ONE CUSTOMER
async findByCustomer(user: AuthUser, customerId: number) {
  const customer = await this.prisma.customer.findFirst({
    where: {
      id: customerId,
      organizationId: user.organizationId,
      // MEMBER: can only view notes on their assigned customers
      ...(user.role !== 'ADMIN' && {
        assignedToId: user.id,
      }),
    },
  });

  if (!customer) {
    throw new NotFoundException('Customer not found');
  }

  // ALL notes for this customer — no createdById filter
  return this.prisma.note.findMany({
    where: {
      customerId,
      organizationId: user.organizationId,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
}