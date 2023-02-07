import { Injectable } from '@nestjs/common';
import { EmailAdapter } from '../adapters/email.adapter';

@Injectable()
export class EmailManager {
  constructor(protected emailAdapter: EmailAdapter) {}

  async sendEmail(): Promise<void> {
    return;
  }
}
