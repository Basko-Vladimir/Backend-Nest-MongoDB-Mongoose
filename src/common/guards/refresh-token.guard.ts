import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../../auth/jwt.service';
import { UsersRepository } from '../../users/users.repository';
import { DevicesSessionsRepository } from '../../devices-sessions/devices-sessions.repository';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
    private devicesSessionsRepository: DevicesSessionsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) throw new UnauthorizedException();

    const tokenPayload = await this.jwtService.getTokenPayload(refreshToken);
    const currentDeviceSession =
      await this.devicesSessionsRepository.findDeviceSessionByFilter({
        deviceId: tokenPayload?.deviceId,
        issuedAt: tokenPayload?.iat,
      });

    if (!tokenPayload || !currentDeviceSession) {
      throw new UnauthorizedException();
    }

    const user = await this.usersRepository.findUserById(tokenPayload.userId);
    request.context = { user, session: currentDeviceSession };

    return true;
  }
}
