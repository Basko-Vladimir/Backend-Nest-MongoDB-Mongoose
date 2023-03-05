import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { DevicesSessionsRepository } from '../../infrastructure/devices-sessions.repository';

export class DeleteAllDevicesSessionsExceptCurrentCommand {
  constructor(public deviceSessionId: Types.ObjectId) {}
}

@CommandHandler(DeleteAllDevicesSessionsExceptCurrentCommand)
export class DeleteAllDevicesSessionsExceptCurrentUseCase
  implements ICommandHandler<DeleteAllDevicesSessionsExceptCurrentCommand>
{
  constructor(private devicesSessionsRepository: DevicesSessionsRepository) {}

  async execute(
    command: DeleteAllDevicesSessionsExceptCurrentCommand,
  ): Promise<void> {
    return this.devicesSessionsRepository.deleteAllDevicesSessionsExceptCurrent(
      command.deviceSessionId,
    );
  }
}
