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
import type { AuthenticatedRequest } from '../shared/types/auth.types';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateCustomerDto) {
    return this.customersService.create(req.user, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest, @Query() query: QueryCustomerDto) {
    return this.customersService.findAll(req.user, query);
  }

  // UPDATE
  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: CreateCustomerDto,
  ) {
    return this.customersService.update(req.user, Number(id), dto);
  }

  // SOFT DELETE
  @Patch(':id/delete')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.customersService.remove(req.user, Number(id));
  }

  // RESTORE
  @Patch(':id/restore')
  restore(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.customersService.restore(req.user, Number(id));
  }

  @Patch(':id/assign/:userId')
  assign(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.customersService.assignCustomer(
      req.user,
      Number(id),
      Number(userId),
    );
  }
}
