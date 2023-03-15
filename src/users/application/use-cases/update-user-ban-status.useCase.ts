import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserBanStatusDto } from '../../api/dto/update-user-ban-status.dto';
import { UsersRepository } from '../../infrastructure/users.repository';

export class UpdateUserBanStatusCommand {
  constructor(
    public userId: string,
    public updateUserBanStatusDto: UpdateUserBanStatusDto,
  ) {}
}

@CommandHandler(UpdateUserBanStatusCommand)
export class UpdateUserBanStatusUseCase
  implements ICommandHandler<UpdateUserBanStatusCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: UpdateUserBanStatusCommand): Promise<void> {
    const { userId, updateUserBanStatusDto } = command;

    const targetUser = await this.usersRepository.findUserById(userId);

    if (!targetUser) {
      throw new NotFoundException();
    }

    await targetUser.updateUserBanStatus(updateUserBanStatusDto);
    await this.usersRepository.saveUser(targetUser);
  }
}
