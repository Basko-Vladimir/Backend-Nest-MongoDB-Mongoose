import { DeviceSessionDocument } from '../schemas/device-session.schema';
import { DeviceSessionOutputModel } from '../api/dto/devices-sessions-output-models.dto';

export const mapDbDeviceSessionToDeviceSessionOutputModel = (
  deviceSession: DeviceSessionDocument,
): DeviceSessionOutputModel => {
  return {
    ip: deviceSession.ip,
    title: deviceSession.deviceName,
    lastActiveDate: deviceSession.issuedAt
      ? new Date(deviceSession.issuedAt).toISOString()
      : 'No lastActiveDate',
    deviceId: String(deviceSession.deviceId) || '',
  };
};
