import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { Request } from 'express';
import { confirmationCodeErrorMessages } from '../common/error-messages';
import { IErrorOutputModel } from '../common/types';

@Injectable()
export class RegistrationConfirmationGuard implements CanActivate {
  constructor(private userRepository: UsersRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const code = request.body.code;
    const error: IErrorOutputModel = { message: '', field: 'code' };

    const user = await this.userRepository.findUserByFilter({
      ['emailConfirmation.confirmationCode']: code,
    });
    const { INVALID_CONFIRMATION_CODE, EXISTED_CONFIRMATION_CODE } =
      confirmationCodeErrorMessages;

    if (user) {
      if (user.emailConfirmation.isConfirmed) {
        error.message = EXISTED_CONFIRMATION_CODE;
        throw new BadRequestException([error]);
      } else if (user.emailConfirmation.confirmationCode !== code) {
        error.message = INVALID_CONFIRMATION_CODE;
        throw new BadRequestException([error]);
      }

      request.context = { user };
      return true;
    } else {
      error.message = INVALID_CONFIRMATION_CODE;
      throw new BadRequestException([error]);
    }
  }
}
