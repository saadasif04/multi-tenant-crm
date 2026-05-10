import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUser } from 'src/shared/types/auth.types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // CREATE USER
  async create(user: AuthUser, dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    console.log('dto', dto);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        organizationId: user.organizationId,
      },
    });
  }

  // GET USERS BY ORG
  async findAll(organizationId: number) {
    return this.prisma.user.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
}
