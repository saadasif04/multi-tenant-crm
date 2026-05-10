import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import type { AuthenticatedRequest } from '../shared/types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 🔑 LOGIN
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  // 🆕 SIGNUP (IMPORTANT)
  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  // 👤 CURRENT USER
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  // 🚪 LOGOUT
  @Post('logout')
  logout() {
    return this.authService.logout();
  }
}
