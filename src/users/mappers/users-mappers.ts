import { UserDocument } from '../schemas/user.schema';

export interface IUserOutputModel {
  id: string;
  login: string;
  email: string;
  createdAt?: string;
}

export const mapDbUserToUserOutputModel = (
  user: UserDocument,
): IUserOutputModel => ({
  id: String(user._id),
  login: user.login,
  email: user.email,
  createdAt: user.createdAt.toISOString(),
});
