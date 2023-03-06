import { Types } from 'mongoose';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { generateCustomBadRequestException } from '../utils';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { IdTypes } from '../enums';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { CommentsRepository } from '../../comments/infrastructure/comments.repository';
import { UsersRepository } from '../../users/infrastructure/users.repository';

@Injectable()
export class checkParamIdPipe implements PipeTransform {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected commentsRepository: CommentsRepository,
    protected usersRepository: UsersRepository,
  ) {}

  async transform(id: string, metaData: ArgumentMetadata): Promise<string> {
    const validObjectId = Types.ObjectId.isValid(id);

    if (!validObjectId) {
      generateCustomBadRequestException('Invalid paramId', 'paramId');
    }

    switch (metaData.data) {
      case IdTypes.BLOG_ID: {
        await this.blogsRepository.findBlogById(id);
        break;
      }
      case IdTypes.POST_ID: {
        await this.postsRepository.findPostById(id);
        break;
      }
      case IdTypes.COMMENT_ID: {
        await this.commentsRepository.findCommentById(id);
        break;
      }
      case IdTypes.USER_ID: {
        const user = await this.usersRepository.findUserById(id);

        if (!user) {
          generateCustomBadRequestException('Invalid paramId', 'paramId');
        }
        break;
      }
    }

    return id;
  }
}
