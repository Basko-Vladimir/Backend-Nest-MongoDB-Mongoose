import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserDocument } from '../../users/schemas/user.schema';

@Injectable()
export class BannedUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user: UserDocument = request?.context?.user;

    if (!user || user.banInfo.isBanned) {
      throw new NotFoundException();
    }

    return true;
  }
}
