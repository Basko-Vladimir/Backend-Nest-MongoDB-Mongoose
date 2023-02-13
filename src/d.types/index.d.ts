import { UserDocument } from '../users/schemas/userSchema';

declare global {
  declare namespace Express {
    export interface Request {
      context: {
        user?: UserDocument;
      };
    }
  }
}
