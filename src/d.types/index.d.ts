import { UserDocument } from '../users/schemas/userSchema';
import { DeviceSessionDocument } from '../devices-sessions/schemas/device-session.schema';

declare global {
  declare namespace Express {
    export interface Request {
      context: {
        user?: UserDocument;
        session?: DeviceSessionDocument;
      };
    }
  }
}
