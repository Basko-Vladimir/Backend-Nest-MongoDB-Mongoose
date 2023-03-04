import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailDto } from '../../api/dto/email.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { EmailManager } from '../../../common/managers/email.manager';

export class RecoverPasswordCommand {
  constructor(public emailDto: EmailDto) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordUseCase
  implements ICommandHandler<RecoverPasswordCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailManager: EmailManager,
  ) {}

  async execute(command: RecoverPasswordCommand): Promise<void> {
    const { email } = command.emailDto;
    const targetUser = await this.usersRepository.findUserByFilter({ email });
    const updatedUser = targetUser.updatePasswordRecoveryCode(targetUser);
    const savedUser = await this.usersRepository.saveUser(updatedUser);

    try {
      return this.emailManager.recoverPassword(
        email,
        savedUser.passwordRecoveryCode,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
