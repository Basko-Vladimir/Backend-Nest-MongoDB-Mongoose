import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from './users/schemas/userSchema';
import { Blog, BlogModelType } from './blogs/schemas/blog.schema';
import { Post, PostModelType } from './posts/schemas/post.schema';
import { Like, LikeModelType } from './likes/schemas/like.schema';
import { Comment } from './comments/schemas/comment.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(Like.name) private LikeModel: LikeModelType,
    @InjectModel(Comment.name) private CommentModel: LikeModelType,
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
    ]);
  }
}
