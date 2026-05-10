import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import type { AuthenticatedRequest } from '../shared/types/auth.types';

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private service: NotesService) {}

  // CREATE NOTE
  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateNoteDto) {
    return this.service.create(req.user, dto);
  }

  // GET ALL NOTES
  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.service.findAll(req.user);
  }

  // GET NOTES BY CUSTOMER
  @Get('customer/:id')
  findByCustomer(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.findByCustomer(req.user, Number(id));
  }
}
