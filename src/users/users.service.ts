import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from './schemas/user.schema';
import { UserQueryParamsDto } from './dto/user-query-params.dto';
import { AllUsersOutputModel } from './dto/users-models.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    protected usersRepository: UsersRepository,
  ) {}

  async findAllUsers(
    queryParams: UserQueryParamsDto,
  ): Promise<AllUsersOutputModel> {
    return this.usersRepository.findAllUsers(queryParams);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = this.UserModel.createUserEntity(
      createUserDto,
      this.UserModel,
    );

    return this.usersRepository.saveUser(createdUser);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.usersRepository.deleteUser(userId);
  }
}
