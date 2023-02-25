import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../../auth/jwt.service';
import { UsersRepository } from '../../users/users.repository';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) throw new UnauthorizedException();

    const tokenPayload = await this.jwtService.getTokenPayload(refreshToken);
    // const currentDeviceSession = await deviceSessionService
    //   .getDeviceSessionByFilter({deviceId: tokenPayload?.deviceId, issuedAt: tokenPayload?.iat});

    if (!tokenPayload) throw new UnauthorizedException(); //TODO add '|| !currentDeviceSession'

    const user = await this.usersRepository.findUserById(tokenPayload.userId);

    request.context = { user }; //TODO add 'session: currentDeviceSession'
    return true;
  }
}
