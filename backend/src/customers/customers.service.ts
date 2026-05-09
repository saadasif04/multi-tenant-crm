import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { AuthUser } from '../shared/types/auth.types';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(user: AuthUser, dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        organizationId: user.organizationId,
        assignedToId: user.id,
        createdById: user.id,
      },
    });
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
    return this.prisma.customer.update({
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
  }

  // SOFT DELETE
  async remove(user: AuthUser, id: number) {
    return this.prisma.customer.update({
      where: {
        id,
        organizationId: user.organizationId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // RESTORE
  async restore(user: AuthUser, id: number) {
    return this.prisma.customer.update({
      where: {
        id,
        organizationId: user.organizationId,
      },
      data: {
        deletedAt: null,
      },
    });
  }
}
