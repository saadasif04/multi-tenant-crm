import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: {
    id: number;
    email: string;
    role: string;
    organizationId: number;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreateCustomerDto) {
    return this.customersService.create(req.user, dto);
  }

  @Get()
  findAll(@Req() req: AuthRequest, @Query() query: QueryCustomerDto) {
    return this.customersService.findAll(req.user, query);
  }

  // UPDATE
  @Patch(':id')
  update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: CreateCustomerDto,
  ) {
    return this.customersService.update(req.user, Number(id), dto);
  }

  // SOFT DELETE
  @Patch(':id/delete')
  remove(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.customersService.remove(req.user, Number(id));
  }

  // RESTORE
  @Patch(':id/restore')
  restore(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.customersService.restore(req.user, Number(id));
  }
}
