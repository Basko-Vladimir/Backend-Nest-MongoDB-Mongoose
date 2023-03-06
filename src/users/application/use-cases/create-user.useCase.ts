import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDocument } from '../../schemas/user.schema';
import { CreateUserDto } from '../../api/dto/create-user.dto';
import { validateOrRejectInputDto } from '../../../common/utils';
import { RegisterUserCommand } from '../../../auth/application/use-cases/register-user.useCase';
import { UsersRepository } from '../../infrastructure/users.repository';

export class CreateUserCommand {
  constructor(public createUserDto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private commandBus: CommandBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserDocument> {
    const { createUserDto } = command;
    await validateOrRejectInputDto(createUserDto, CreateUserDto);

    const createdUserId = await this.commandBus.execute(
      new RegisterUserCommand(createUserDto),
    );

    return this.usersRepository.findUserById(createdUserId);
  }
}
