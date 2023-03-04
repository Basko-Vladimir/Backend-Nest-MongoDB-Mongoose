import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../schemas/user.schema';
import { getFilterByDbId } from '../../common/utils';
import { UpdateOrFilterModel } from '../../common/types';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) protected UserModel: UserModelType) {}

  async findUserById(userId: string): Promise<UserDocument | null> {
    return this.UserModel.findById(userId);
  }

  async findUserByFilter(
    userFilter: UpdateOrFilterModel,
  ): Promise<UserDocument | null> {
    const filter = Object.keys(userFilter).map((field) => ({
      [field]: userFilter[field as keyof UserDocument],
    }));

    return this.UserModel.findOne({ $or: filter });
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
