import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { ITokensData } from '../../../common/types';
import { DeviceSessionDocument } from '../../../devices-sessions/schemas/device-session.schema';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { DevicesSessionsService } from '../../../devices-sessions/application/devices-sessions.service';
import { JwtService } from '../../infrastructure/jwt.service';
import {
  ACCESS_TOKEN_LIFE_TIME,
  REFRESH_TOKEN_LIFE_TIME,
} from '../../../common/constants';

export class RefreshTokensCommand {
  constructor(public userId: string, public session: DeviceSessionDocument) {}
}

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensUseCase
  implements ICommandHandler<RefreshTokensCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private devicesSessionsService: DevicesSessionsService,
    private authService: AuthService,
  ) {}

  async execute(command: RefreshTokensCommand): Promise<ITokensData> {
    const { userId, session } = command;
    const { accessToken, refreshToken } =
      await this.authService.createNewTokensPair(
        { userId },
        ACCESS_TOKEN_LIFE_TIME,
        { userId, deviceId: session.deviceId },
        REFRESH_TOKEN_LIFE_TIME,
      );
    const refreshTokenPayload = await this.jwtService.getTokenPayload(
      refreshToken,
    );

    if (!refreshTokenPayload) {
      throw new Error(`Couldn't get payload from refresh token!`);
    }

    await this.devicesSessionsService.updateDeviceSessionData(
      session,
      refreshTokenPayload.iat,
    );

    return {
      accessToken,
      refreshToken,
      refreshTokenSettings: AuthService.getCookieSettings(refreshTokenPayload),
    };
  }
}
