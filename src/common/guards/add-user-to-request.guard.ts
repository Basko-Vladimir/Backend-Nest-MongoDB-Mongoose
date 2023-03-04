import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../../auth/infrastructure/jwt.service';
import { UsersService } from '../../users/users.service';
import { AuthType } from '../enums';

@Injectable()
export class AddUserToRequestGuard implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    request.context = {};

    if (authHeader) {
      const [authType, authValue] = authHeader.split(' ');

      if (authType.toLowerCase() === AuthType.BEARER) {
        const tokenPayload = await this.jwtService.getTokenPayload(authValue);

        const user = await this.userService.findUserById(tokenPayload.userId);
        if (user) request.context = { user };
      }
    }

    return true;
  }
}
