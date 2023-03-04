import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from './schemas/user.schema';
import { UsersQueryParamsDto } from './dto/users-query-params.dto';
import { AllUsersOutputModel } from './dto/users-output-models.dto';
import { validateOrRejectInputDto } from '../common/utils';
import { AuthService } from '../auth/application/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) protected UserModel: UserModelType,
    protected usersRepository: UsersRepository,
    protected authService: AuthService,
  ) {}

  async findAllUsers(
    queryParams: UsersQueryParamsDto,
  ): Promise<AllUsersOutputModel> {
    return this.usersRepository.findAllUsers(queryParams);
  }

  async findUserById(userId: string): Promise<UserDocument | null> {
    return this.usersRepository.findUserById(userId);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    await validateOrRejectInputDto(createUserDto, CreateUserDto);

    const createdUserId = await this.authService.registerUser(
      createUserDto,
      true,
    );

    return this.usersRepository.findUserById(createdUserId);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.usersRepository.deleteUser(userId);
  }
}
