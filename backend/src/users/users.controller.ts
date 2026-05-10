import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../shared/enums/role.enum';
import { RolesGuard } from '../shared/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import type { AuthenticatedRequest } from 'src/shared/types/auth.types';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ADMIN ONLY CREATE USER
  @Post()
  @Roles(Role.ADMIN)
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateUserDto) {
    return this.usersService.create(req.user, dto);
  }

  // GET USERS (ORG SCOPED)
  @Get()
  getUsers(@Req() req: AuthenticatedRequest) {
    return this.usersService.findAll(req.user.organizationId);
  }
}
