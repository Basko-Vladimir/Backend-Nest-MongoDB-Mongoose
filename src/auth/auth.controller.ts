import { Response } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginOutputModel } from './dto/login-output-model.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfirmRegistrationDto } from './dto/confirm-registration.dto';
import { RegistrationConfirmationGuard } from '../common/guards/registration-confirmation.guard';
import { User } from '../common/decorators/user.decorator';
import { UserDocument } from '../users/schemas/user.schema';
import { EmailDto } from './dto/email.dto';
import { ResendingRegistrationEmailGuard } from '../common/guards/resending-registration-email.guard';
import { SetNewPasswordDto } from './dto/set-new-password.dto';
import { PasswordRecoveryCodeGuard } from '../common/guards/password-recovery-code.guard';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.authService.registerUser(createUserDto);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RegistrationConfirmationGuard)
  async confirmRegistration(
    @Body() confirmRegistrationDto: ConfirmRegistrationDto,
    @User() user: UserDocument,
  ): Promise<void> {
    await this.authService.confirmRegistration(confirmRegistrationDto, user);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ResendingRegistrationEmailGuard)
  async resendRegistrationEmail(
    @Body() emailDto: EmailDto,
    @User() user: UserDocument,
  ): Promise<void> {
    return this.authService.resendRegistrationEmail(emailDto, user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginOutputModel> {
    const { accessToken, refreshToken } = await this.authService.login(
      loginUserDto,
    );
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoverPassword(@Body() emailDto: EmailDto): Promise<void> {
    return this.authService.recoverPassword(emailDto);
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PasswordRecoveryCodeGuard)
  async setNewPassword(
    @Body() setNewPasswordDto: SetNewPasswordDto,
    @User() user: UserDocument,
  ): Promise<void> {
    return this.authService.setNewPassword(setNewPasswordDto, user);
  }
}
