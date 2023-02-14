import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthType } from '../enums';
import { JwtService } from '../../auth/jwt.service';
import { UsersService } from '../../users/users.service';
import { authErrorsMessages } from '../error-messages';

const { INCORRECT_LOGIN_OR_PASSWORD, INVALID_TOKEN } = authErrorsMessages;
const BASIC_AUTH_CREDENTIALS_BASE64 = 'YWRtaW46cXdlcnR5';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(INCORRECT_LOGIN_OR_PASSWORD);
    }

    const [authType = '', authValue = ''] = authHeader.split(' ');

    if (authType.toLowerCase() === AuthType.BASIC) {
      if (authValue !== BASIC_AUTH_CREDENTIALS_BASE64) {
        throw new UnauthorizedException();
      }
    } else if (authType.toLowerCase() === AuthType.BEARER) {
      const tokenPayload = await this.jwtService.getTokenPayload(authValue);

      if (!tokenPayload) {
        throw new UnauthorizedException(INVALID_TOKEN);
      }

      let targetUser;
      try {
        targetUser = await this.userService.findUserById(tokenPayload.userId);
      } catch {
        throw new UnauthorizedException();
      }

      request.context = { user: targetUser };
    }

    return true;
  }
}
