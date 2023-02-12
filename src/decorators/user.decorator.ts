import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../users/schemas/userSchema';

export const User = createParamDecorator(
  (data: (keyof UserDocument)[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
