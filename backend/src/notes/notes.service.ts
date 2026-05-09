import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthUser } from '../shared/types/auth.types';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  // CREATE NOTE
  async create(user: AuthUser, dto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        content: dto.content,
        customerId: dto.customerId,
        organizationId: user.organizationId,
        createdById: user.id,
      },
    });
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
