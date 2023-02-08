import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../auth/jwt.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new UnauthorizedException();

    const token = authHeader.split(' ')[0];
    const tokenPayload = await this.jwtService.getTokenPayload(token);

    if (!tokenPayload) throw new UnauthorizedException();

    const targetUser = await this.userService.findUserById(tokenPayload.userId);

    if (!targetUser) throw new UnauthorizedException();

    return true;
  }
}
