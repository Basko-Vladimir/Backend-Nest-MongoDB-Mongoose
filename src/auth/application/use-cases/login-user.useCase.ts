import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ITokensData } from '../../../common/types';
import { LoginUserDto } from '../../api/dto/login-user.dto';
import { JwtService } from '../../infrastructure/jwt.service';
import { DevicesSessionsService } from '../../../devices-sessions/devices-sessions.service';
import {
  ACCESS_TOKEN_LIFE_TIME,
  REFRESH_TOKEN_LIFE_TIME,
} from '../../../common/constants';
import { DeviceSession } from '../../../devices-sessions/schemas/device-session.schema';
import { AuthService } from '../auth.service';

export class LoginUserCommand {
  constructor(
    public loginUserDto: LoginUserDto,
    public ip: string,
    public userAgent: string,
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    private jwtService: JwtService,
    private devicesSessionsService: DevicesSessionsService,
    private authService: AuthService,
  ) {}

  async execute(command: LoginUserCommand): Promise<ITokensData> {
    const { loginUserDto, userAgent, ip } = command;
    const { loginOrEmail, password } = loginUserDto;
    const userId = await this.authService.checkCredentials(
      loginOrEmail,
      password,
    );

    if (!userId) throw new UnauthorizedException();

    const deviceId = uuidv4();
    const { accessToken, refreshToken } =
      await this.authService.createNewTokensPair(
        { userId },
        ACCESS_TOKEN_LIFE_TIME,
        { userId, deviceId },
        REFRESH_TOKEN_LIFE_TIME,
      );
    const refreshTokenPayload = await this.jwtService.getTokenPayload(
      refreshToken,
    );

    if (!refreshTokenPayload) {
      throw new Error(`Couldn't get payload from refresh token!`);
    }

    const deviceSessionData: Partial<DeviceSession> = {
      issuedAt: refreshTokenPayload.iat,
      expiredDate: refreshTokenPayload.exp,
      deviceId: refreshTokenPayload.deviceId,
      deviceName: userAgent,
      ip,
      userId: new Types.ObjectId(userId),
    };

    await this.devicesSessionsService.createDeviceSession(deviceSessionData);

    return {
      accessToken,
      refreshToken,
      refreshTokenSettings: AuthService.getCookieSettings(refreshTokenPayload),
    };
  }
}
