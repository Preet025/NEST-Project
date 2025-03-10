import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, VerifyDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  signup(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Get('verify')
  verify(@Query() dto: VerifyDto) {
    return this.authService.verify(dto);
  }
}
