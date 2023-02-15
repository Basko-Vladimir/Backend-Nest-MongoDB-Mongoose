import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../../auth/jwt.service';
import { UsersService } from '../../users/users.service';

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
      const token = authHeader.split(' ')[1];
      const tokenPayload = await this.jwtService.getTokenPayload(token);

      const user = await this.userService.findUserById(tokenPayload.userId);
      if (user) {
        request.context = { user };
      }
    }

    return true;
  }
}
