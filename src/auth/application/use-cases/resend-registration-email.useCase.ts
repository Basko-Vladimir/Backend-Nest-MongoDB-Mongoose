import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDocument } from '../../../users/schemas/user.schema';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailManager } from '../../../common/managers/email.manager';

export class ResendRegistrationEmailCommand {
  constructor(public user: UserDocument) {}
}

@CommandHandler(ResendRegistrationEmailCommand)
export class ResendRegistrationEmailUseCase
  implements ICommandHandler<ResendRegistrationEmailCommand>
{
  constructor(
    protected usersRepository: UsersRepository,
    protected emailManager: EmailManager,
  ) {}

  async execute(command: ResendRegistrationEmailCommand): Promise<void> {
    const { user } = command;

    user.updateConfirmationCode();

    const savedUser = await this.usersRepository.saveUser(user);

    await this.emailManager.formRegistrationEmail(savedUser);
  }
}
