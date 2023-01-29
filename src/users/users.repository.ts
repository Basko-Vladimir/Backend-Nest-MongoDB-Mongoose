import { Injectable } from '@nestjs/common';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  async findAllUsers() {
    return [];
  }

  async saveUser(user: UserDocument): Promise<UserDocument> {
    return user.save();
  }

  async deleteUser(userId: string) {
    return userId;
  }
}
