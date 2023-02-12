import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.authService.registerUser(createUserDto);
  }
}
