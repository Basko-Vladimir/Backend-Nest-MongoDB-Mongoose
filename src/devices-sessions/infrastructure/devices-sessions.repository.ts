import { Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  DeviceSession,
  DeviceSessionDocument,
  DeviceSessionModelType,
} from '../schemas/device-session.schema';
import { UpdateOrFilterModel } from '../../common/types';
import { getFilterByDbId } from '../../common/utils';

@Injectable()
export class DevicesSessionsRepository {
  constructor(
    @InjectModel(DeviceSession.name)
    protected DeviceSessionModel: DeviceSessionModelType,
  ) {}

  async findDeviceSessionByFilter(
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

  async deleteDeviceSessionById(id: string): Promise<void> {
    const { deletedCount } = await this.DeviceSessionModel.deleteOne(
      getFilterByDbId(id),
    );

    if (!deletedCount) throw new NotFoundException();
  }
}
