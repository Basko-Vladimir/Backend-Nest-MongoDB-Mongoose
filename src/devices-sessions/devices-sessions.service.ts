import { Injectable } from '@nestjs/common';
import { DevicesSessionsRepository } from './devices-sessions.repository';
import { UpdateOrFilterModel } from '../common/types';
import { DeviceSessionOutputModel } from './dto/devices-sessions-output-models.dto';
import {
  DeviceSession,
  DeviceSessionModelType,
} from './schemas/device-session.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DevicesSessionsService {
  constructor(
    protected devicesSessionsRepository: DevicesSessionsRepository,
    @InjectModel(DeviceSession.name)
    protected DeviceSessionModel: DeviceSessionModelType,
  ) {}

  async getAllActiveDevicesSessions(
    filter: UpdateOrFilterModel,
  ): Promise<DeviceSessionOutputModel[]> {
    return this.devicesSessionsRepository.getAllActiveDevicesSessions(filter);
  }

  async createDeviceSession(deviceSessionData: DeviceSession): Promise<void> {
    const createdDeviceSession =
      this.DeviceSessionModel.createDeviceSessionEntity(
        deviceSessionData,
        this.DeviceSessionModel,
      );

    await this.devicesSessionsRepository.saveDeviceSession(
      createdDeviceSession,
    );
  }
}
