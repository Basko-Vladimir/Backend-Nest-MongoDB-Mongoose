import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DeviceSession {
  @Prop({
    type: Number,
    required: true,
  })
  issuedAt: number;

  @Prop({
    type: Number,
    required: true,
  })
  expiredDate: number;

  @Prop({
    type: Types.ObjectId,
    required: true,
    trim: true,
  })
  deviceId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  deviceName: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  ip: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  static createDeviceSessionEntity(
    deviceSessionData: Partial<DeviceSession>,
    DeviceSessionModel: DeviceSessionModelType,
  ): DeviceSessionDocument {
    return new DeviceSessionModel(deviceSessionData);
  }

  updateDeviceSessionData(issuedAt: number): void {
    this.issuedAt = issuedAt;
  }
}

export type DeviceSessionDocument = HydratedDocument<DeviceSession>;

interface IDeviceSessionStaticMethods {
  createDeviceSessionEntity(
    deviceSessionData: Partial<DeviceSession>,
    DeviceSessionModel: DeviceSessionModelType,
  ): DeviceSessionDocument;
}

export type DeviceSessionModelType = Model<DeviceSession> &
  IDeviceSessionStaticMethods;

export const deviceSessionSchema = SchemaFactory.createForClass(DeviceSession);

deviceSessionSchema.static(
  'createDeviceSessionEntity',
  DeviceSession.createDeviceSessionEntity,
);
deviceSessionSchema.method(
  'updateDeviceSessionData',
  DeviceSession.prototype.updateDeviceSessionData,
);
