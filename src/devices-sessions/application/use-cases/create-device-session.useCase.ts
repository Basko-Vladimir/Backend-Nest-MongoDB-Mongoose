import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import {
  DeviceSession,
  DeviceSessionModelType,
} from '../../schemas/device-session.schema';
import { DevicesSessionsRepository } from '../../infrastructure/devices-sessions.repository';

export class CreateDeviceSessionCommand {
  constructor(public deviceSessionData: Partial<DeviceSession>) {}
}

@CommandHandler(CreateDeviceSessionCommand)
export class CreateDeviceSessionUseCase
  implements ICommandHandler<CreateDeviceSessionCommand>
{
  constructor(
    private devicesSessionsRepository: DevicesSessionsRepository,
    @InjectModel(DeviceSession.name)
    private DeviceSessionModel: DeviceSessionModelType,
  ) {}

  async execute(command: CreateDeviceSessionCommand): Promise<void> {
    const createdDeviceSession =
      this.DeviceSessionModel.createDeviceSessionEntity(
        command.deviceSessionData,
        this.DeviceSessionModel,
      );

    await this.devicesSessionsRepository.saveDeviceSession(
      createdDeviceSession,
    );
  }
}
