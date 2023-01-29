import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    protected usersRepository: UsersRepository,
  ) {}

  async findAllUsers() {
    return this.usersRepository.findAllUsers();
  }

  async createUser(createUserDto: CreateUserDto) {
    const createdUser = this.UserModel.createUserEntity(
      createUserDto,
      this.UserModel,
    );

    return this.usersRepository.saveUser(createdUser);
  }

  async deleteUser(userId: string) {
    return this.usersRepository.deleteUser(userId);
  }
}
