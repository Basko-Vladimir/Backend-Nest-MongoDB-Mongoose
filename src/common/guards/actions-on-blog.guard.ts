import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';

@Injectable()
export class ActionsOnBlogGuard implements CanActivate {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { blogId, id, postId } = request.params;
    const user = request.context.user;
    const blog = await this.blogsRepository.findBlogById(blogId || id);

    if (postId) {
      await this.postsRepository.findPostById(postId);
    }

    if (blog.blogOwnerInfo?.ownerId !== String(user._id)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
