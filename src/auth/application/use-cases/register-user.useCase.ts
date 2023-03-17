import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../auth.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailManager } from '../../../common/managers/email.manager';
import { CreateUserDto } from '../../../users/api/dto/create-user.dto';
import { User, UserModelType } from '../../../users/schemas/user.schema';

export class RegisterUserCommand {
  constructor(
    public createUserDto: CreateUserDto,
    public isConfirmedByDefault: boolean = false,
  ) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailManager: EmailManager,
    @InjectModel(User.name) protected UserModel: UserModelType,
  ) {}

  async execute(command: RegisterUserCommand): Promise<string> {
    const { createUserDto, isConfirmedByDefault } = command;
    const { password } = createUserDto;
    const passwordHash = await AuthService.generatePasswordHash(password);
    const createdUser = await this.UserModel.createUserEntity(
      createUserDto,
      passwordHash,
      isConfirmedByDefault,
      this.UserModel,
    );
    const savedUser = await this.usersRepository.saveUser(createdUser);
    const savedUserId = String(savedUser._id);

    try {
      this.emailManager.formRegistrationEmail(createdUser);
      return savedUserId;
    } catch (error) {
      await this.usersRepository.deleteUser(savedUserId);
      throw new Error(error);
    }
  }
}
