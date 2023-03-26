import { UserDocument } from '../schemas/user.schema';
import { IUserOutputModel } from '../api/dto/users-output-models.dto';
import { IBannedUserForSpecificBlog } from '../api/dto/banned-users-for-specific-blog-output-model.dto';

export const mapDbUserToUserOutputModel = (
  user: UserDocument,
): IUserOutputModel => ({
  id: String(user._id),
  login: user.login,
  email: user.email,
  createdAt: user.createdAt.toISOString(),
  banInfo: {
    isBanned: user.banInfo.isBanned,
    banDate: user.banInfo.banDate ? user.banInfo.banDate.toISOString() : null,
    banReason: user.banInfo.banReason,
  },
});

export const mapDbUserToBannedUserForSpecificBlogOutputModel = (
  user: UserDocument,
  blogId: string,
): IBannedUserForSpecificBlog => {
  const targetBlog = user.bannedForBlogs.find((item) => item.blogId === blogId);

  return {
    id: String(user._id),
    login: user.login,
    banInfo: {
      isBanned: targetBlog.isBanned,
      banDate: targetBlog.banDate ? targetBlog.banDate.toISOString() : null,
      banReason: targetBlog.banReason,
    },
  };
};
