import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { IEmailInfoModel } from '../common/types';

@Injectable()
export class EmailAdapter {
  async sendEmail(messageInfo: IEmailInfoModel): Promise<void> {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.TEST_DEV_EMAIL,
        pass: process.env.TEST_DEV_EMAIL_PASS,
      },
    });

    try {
      const info = await transport.sendMail(messageInfo);
      console.log(info);
    } catch (e) {
      console.log(e);
      throw new Error(`Email server error! : ${e}`);
    }
  }
}
