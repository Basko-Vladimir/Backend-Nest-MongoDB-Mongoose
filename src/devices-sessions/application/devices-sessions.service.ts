import { Injectable } from '@nestjs/common';
import { DevicesSessionsRepository } from '../infrastructure/devices-sessions.repository';
import { UpdateOrFilterModel } from '../../common/types';
import { DeviceSessionDocument } from '../schemas/device-session.schema';

@Injectable()
export class DevicesSessionsService {
  constructor(private devicesSessionsRepository: DevicesSessionsRepository) {}

  async findDeviceSessionByFilter(
    filter: UpdateOrFilterModel,
  ): Promise<DeviceSessionDocument | null> {
    return this.devicesSessionsRepository.findDeviceSessionByFilter(filter);
  }
}
