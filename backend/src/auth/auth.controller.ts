import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: {
    id: number;
    email: string;
    role: string;
    organizationId: number;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 🔑 LOGIN
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  // 👤 GET CURRENT USER
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: AuthRequest) {
    return req.user;
  }

  // 🚪 LOGOUT (frontend removes token)
  @Post('logout')
  logout() {
    return this.authService.logout();
  }
}
