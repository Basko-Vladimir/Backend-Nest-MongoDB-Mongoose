import { Request } from 'express';
import { Types } from 'mongoose';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { generateCustomBadRequestException } from '../utils';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';

@Injectable()
export class BindBlogWithUserGuard implements CanActivate {
  constructor(
    private usersRepository: UsersRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { id: blogId, userId } = request.params;
    const isValidBlogId = Types.ObjectId.isValid(blogId);
    const isValidUserId = Types.ObjectId.isValid(userId);
    let targetBlog, targetUser;

    if (!isValidBlogId || !isValidUserId) {
      generateCustomBadRequestException('Invalid paramsId', 'paramsId');
    }

    try {
      targetUser = await this.usersRepository.findUserById(userId);
      targetBlog = await this.blogsRepository.findBlogById(blogId);

      if (!targetUser) throw new NotFoundException();
    } catch (e) {
      generateCustomBadRequestException('Invalid paramsId', 'paramsId');
    }

    if (targetBlog.blogOwnerInfo) {
      generateCustomBadRequestException(
        'Current blog was bound already!',
        'blogId',
      );
    }

    request.context = { user: targetUser, blog: targetBlog };

    return true;
  }
}
