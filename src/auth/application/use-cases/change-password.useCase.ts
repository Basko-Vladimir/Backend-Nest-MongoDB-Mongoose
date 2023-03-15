import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { SetNewPasswordDto } from '../../api/dto/set-new-password.dto';
import { UserDocument } from '../../../users/schemas/user.schema';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class ChangePasswordCommand {
  constructor(
    public setNewPasswordDto: SetNewPasswordDto,
    public user: UserDocument,
  ) {}
}

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordUseCase
  implements ICommandHandler<ChangePasswordCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    const { setNewPasswordDto, user } = command;
    const { newPassword, recoveryCode } = setNewPasswordDto;
    const newHash = await AuthService.generatePasswordHash(newPassword);

    user.updatePassword(newHash, recoveryCode);
    await this.usersRepository.saveUser(user);
  }
}
