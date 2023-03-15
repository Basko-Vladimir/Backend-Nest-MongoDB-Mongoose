import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDocument } from '../../../users/schemas/user.schema';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class ConfirmRegistrationCommand {
  constructor(public user: UserDocument) {}
}

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationUseCase
  implements ICommandHandler<ConfirmRegistrationCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: ConfirmRegistrationCommand): Promise<void> {
    const { user } = command;

    user.confirmUserRegistration();
    await this.usersRepository.saveUser(user);
  }
}
