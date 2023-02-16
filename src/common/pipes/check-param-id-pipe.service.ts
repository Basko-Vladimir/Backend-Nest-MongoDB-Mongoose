import { Types } from 'mongoose';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { generateCustomBadRequestException } from '../utils';
import { BlogsRepository } from '../../blogs/blogs.repository';
import { IdTypes } from '../enums';
import { PostsRepository } from '../../posts/posts.repository';
import { CommentsRepository } from '../../comments/comments.repository';

@Injectable()
export class checkParamIdPipe implements PipeTransform {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected commentsRepository: CommentsRepository,
  ) {}

  async transform(value: string, metaData: ArgumentMetadata): Promise<string> {
    const validObjectId = Types.ObjectId.isValid(value);

    if (!validObjectId) {
      generateCustomBadRequestException('Invalid paramId', 'paramId');
    }

    switch (metaData.data) {
      case IdTypes.BLOG_ID: {
        await this.blogsRepository.findBlogById(value);
        break;
      }
      case IdTypes.POST_ID: {
        await this.postsRepository.findPostById(value);
        break;
      }
      case IdTypes.COMMENT_ID: {
        await this.commentsRepository.findCommentById(value);
        break;
      }
    }

    return value;
  }
}
