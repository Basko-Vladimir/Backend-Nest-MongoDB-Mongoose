import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../users/schemas/user.schema';
import { UsersRepository } from '../users/users.repository';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { EmailManager } from '../managers/email.manager';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected emailManager: EmailManager,
    @InjectModel(User.name) protected UserModel: UserModelType,
  ) {}

  async registerUser(
    createUserDto: CreateUserDto,
    isConfirmedByDefault?: boolean,
  ): Promise<string> {
    const { password } = createUserDto;
    const passwordHash = await this.generatePasswordHash(password);
    const createdUser = await this.UserModel.createUserEntity(
      createUserDto,
      passwordHash,
      isConfirmedByDefault,
      this.UserModel,
    );
    const savedUser = await this.usersRepository.saveUser(createdUser);
    const savedUserId = String(savedUser._id);

    try {
      await this.emailManager.sendRegistrationEmail(createdUser);
      return savedUserId;
    } catch (error) {
      await this.usersRepository.deleteUser(savedUserId);
      throw new Error(error);
    }
  }

  private async generatePasswordHash(password: string): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, passwordSalt);
  }
}
