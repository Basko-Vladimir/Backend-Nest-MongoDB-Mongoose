import { UserDocument } from '../users/schemas/userSchema';
import { DeviceSessionDocument } from '../devices-sessions/schemas/device-session.schema';
import { BlogDocument } from '../blogs/schemas/blog.schema';

declare global {
  declare namespace Express {
    export interface Request {
      context: {
        user?: UserDocument;
        session?: DeviceSessionDocument;
        blog?: BlogDocument;
      };
    }
  }
}
