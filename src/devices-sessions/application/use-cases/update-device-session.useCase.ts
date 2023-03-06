import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceSessionDocument } from '../../schemas/device-session.schema';
import { DevicesSessionsRepository } from '../../infrastructure/devices-sessions.repository';

export class UpdateDeviceSessionCommand {
  constructor(public session: DeviceSessionDocument, public issuedAt: number) {}
}

@CommandHandler(UpdateDeviceSessionCommand)
export class UpdateDeviceSessionUseCase
  implements ICommandHandler<UpdateDeviceSessionCommand>
{
  constructor(private devicesSessionsRepository: DevicesSessionsRepository) {}

  async execute(command: UpdateDeviceSessionCommand): Promise<void> {
    const { session, issuedAt } = command;
    const updatedDeviceSession = await session.updateDeviceSessionData(
      issuedAt,
      session,
    );

    await this.devicesSessionsRepository.saveDeviceSession(
      updatedDeviceSession,
    );
  }
}
