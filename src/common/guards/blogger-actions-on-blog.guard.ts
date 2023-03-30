import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';

@Injectable()
export class BloggerActionsOnBlogGuard implements CanActivate {
  constructor(private blogsRepository: BlogsRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { blogId } = request.body;
    const user = request.context.user;
    const blog = await this.blogsRepository.findBlogById(blogId);

    if (blog.blogOwnerInfo.ownerId !== String(user._id)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
