import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from './users/schemas/userSchema';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  getHello(): string {
    return 'Hello World!';
  }

  async clearDatabase(): Promise<void> {
    await this.UserModel.deleteMany({});
  }
}
