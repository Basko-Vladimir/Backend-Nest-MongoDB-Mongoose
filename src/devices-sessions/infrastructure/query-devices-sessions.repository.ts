import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  DeviceSession,
  DeviceSessionModelType,
} from '../schemas/device-session.schema';
import { UpdateOrFilterModel } from '../../common/types';
import { mapDbDeviceSessionToDeviceSessionOutputModel } from '../mappers/devices-sessions.mapper';
import { DeviceSessionOutputModel } from '../api/dto/devices-sessions-output-models.dto';

@Injectable()
export class QueryDevicesSessionsRepository {
  constructor(
    @InjectModel(DeviceSession.name)
    protected DeviceSessionModel: DeviceSessionModelType,
  ) {}

  async getAllActiveDevicesSessions(
    filter: UpdateOrFilterModel,
  ): Promise<DeviceSessionOutputModel[]> {
    const devicesSessions = await this.DeviceSessionModel.find(filter);

    return devicesSessions.map(mapDbDeviceSessionToDeviceSessionOutputModel);
  }
}
