import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from './schemas/user.schema';
import { getFilterByDbId } from '../common/utils';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async findAllUsers() {
    return [];
  }

  async saveUser(user: UserDocument): Promise<UserDocument> {
    return user.save();
  }

  async deleteUser(userId: string): Promise<void> {
    const { deletedCount } = await this.UserModel.deleteOne(
      getFilterByDbId(userId),
    );

    if (!deletedCount) throw new NotFoundException();
  }
}
