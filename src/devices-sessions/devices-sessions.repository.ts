import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  DeviceSession,
  DeviceSessionDocument,
  DeviceSessionModelType,
} from './schemas/device-session.schema';
import { UpdateOrFilterModel } from '../common/types';
import { mapDbDeviceSessionToDeviceSessionOutputModel } from './mappers/devices-sessions.mapper';
import { DeviceSessionOutputModel } from './dto/devices-sessions-output-models.dto';

@Injectable()
export class DevicesSessionsRepository {
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

  async findDevicesSessionByFilter(
    filter: UpdateOrFilterModel,
  ): Promise<DeviceSessionDocument | null> {
    return this.DeviceSessionModel.findOne(filter);
  }

  async saveDeviceSession(
    deviceSession: DeviceSessionDocument,
  ): Promise<DeviceSessionDocument> {
    return deviceSession.save();
  }

  async deleteAllDevicesSessionsExceptCurrent(
    deviceSessionId: Types.ObjectId,
  ): Promise<void> {
    await this.DeviceSessionModel.deleteMany({
      _id: { $ne: deviceSessionId },
    });
  }
}
