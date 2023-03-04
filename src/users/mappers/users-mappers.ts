import { UserDocument } from '../schemas/user.schema';
import { IUserOutputModel } from '../api/dto/users-output-models.dto';

export const mapDbUserToUserOutputModel = (
  user: UserDocument,
): IUserOutputModel => ({
  id: String(user._id),
  login: user.login,
  email: user.email,
  createdAt: user.createdAt.toISOString(),
});
