import { Injectable } from '@nestjs/common';
import { EmailAdapter } from '../adapters/email.adapter';
import { IEmailInfoModel } from '../types';
import { UserDocument } from '../../users/schemas/user.schema';

@Injectable()
export class EmailManager {
  constructor(protected emailAdapter: EmailAdapter) {}

  async formRegistrationEmail(userData: UserDocument): Promise<void> {
    const messageInfo: IEmailInfoModel = {
      from: 'Test Backend Server <dev.test.vladimir@gmail.com>',
      to: userData.email,
      subject: 'Test Backend Server Registration',
      html: `<h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
        <a href=https://somesite.com/confirm-email?code=${userData.emailConfirmation.confirmationCode}>
         	Complete registration
        </a>
      </p>`,
    };

    return this.emailAdapter.sendEmail(messageInfo);
  }

  async formRecoverPasswordEmail(
    email: string,
    recoveryCode: string,
  ): Promise<void> {
    const messageInfo: IEmailInfoModel = {
      from: 'Test Backend Server <dev.test.vladimir@gmail.com>',
      to: email,
      subject: 'Test Backend Server Registration',
      html: `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href=https://somesite.com/password-recovery?recoveryCode=${recoveryCode}>Recovery password</a>
      </p>`,
    };

    return this.emailAdapter.sendEmail(messageInfo);
  }
}
