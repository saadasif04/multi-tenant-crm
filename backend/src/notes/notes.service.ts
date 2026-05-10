import { Injectable } from '@nestjs/common';
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
    // 1. Check if customer exists and is not soft deleted
    const customer = await this.prisma.customer.findFirst({
      where: {
        id: dto.customerId,
        organizationId: user.organizationId,
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    if (customer.deletedAt) {
      throw new Error('Cannot add note to deleted customer');
    }

    // 2. Create note
    const note = await this.prisma.note.create({
      data: {
        content: dto.content,
        customerId: dto.customerId,
        organizationId: user.organizationId,
        createdById: user.id,
      },
    });

    // 3. Log activity
    await this.activityLogsService.log({
      user,
      entityType: 'NOTE',
      entityId: note.id,
      action: ActivityAction.CREATED,
    });

    return note;
  }

  // GET NOTES (by org + role)
  async findAll(user: AuthUser) {
    return this.prisma.note.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        customer: true,
        createdBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // GET NOTES FOR ONE CUSTOMER
  async findByCustomer(user: AuthUser, customerId: number) {
    return this.prisma.note.findMany({
      where: {
        customerId,
        organizationId: user.organizationId,
      },
      include: {
        createdBy: true,
      },
    });
  }
}
