import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from './users/schemas/user.schema';
import { Blog, BlogModelType } from './blogs/schemas/blog.schema';
import { Post, PostModelType } from './posts/schemas/post.schema';
import { Like, LikeModelType } from './likes/schemas/like.schema';
import { Comment } from './comments/schemas/comment.schema';
import {
  DeviceSession,
  DeviceSessionModelType,
} from './devices-sessions/schemas/device-session.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(Like.name) private LikeModel: LikeModelType,
    @InjectModel(Comment.name) private CommentModel: LikeModelType,
    @InjectModel(DeviceSession.name)
    private DeviceSessionModel: DeviceSessionModelType,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async clearDatabase(): Promise<void> {
    await Promise.all([
      this.UserModel.deleteMany({}),
      this.BlogModel.deleteMany({}),
      this.PostModel.deleteMany({}),
      this.LikeModel.deleteMany({}),
      this.CommentModel.deleteMany({}),
      this.DeviceSessionModel.deleteMany({}),
    ]);
  }
}
