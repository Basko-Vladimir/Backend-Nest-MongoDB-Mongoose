import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from './users/schemas/userSchema';
import { Blog, BlogModelType } from './blogs/schemas/blog.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async clearDatabase(): Promise<void> {
    await this.UserModel.deleteMany({});
    await this.BlogModel.deleteMany({});
  }
}
