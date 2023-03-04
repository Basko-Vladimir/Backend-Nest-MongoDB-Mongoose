import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthType } from '../enums';
import { JwtService } from '../../auth/infrastructure/jwt.service';
import { UsersService } from '../../users/application/users.service';
import { authErrorsMessages } from '../error-messages';
import { UsersRepository } from '../../users/infrastructure/users.repository';

const { INVALID_TOKEN } = authErrorsMessages;
const BASIC_AUTH_CREDENTIALS_BASE64 = 'YWRtaW46cXdlcnR5';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException();
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

      const targetUser = await this.usersRepository.findUserById(
        tokenPayload.userId,
      );

      if (!targetUser) {
        throw new UnauthorizedException();
      }

      request.context = { user: targetUser };
    }

    return true;
  }
}
