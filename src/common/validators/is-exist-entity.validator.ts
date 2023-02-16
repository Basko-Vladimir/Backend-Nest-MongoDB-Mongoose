import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../../blogs/blogs.repository';
import { PostsRepository } from '../../posts/posts.repository';
import { UsersRepository } from '../../users/users.repository';
import { CommentsRepository } from '../../comments/comments.repository';

enum IdTypes {
  BLOG_ID = 'blogId',
  POST_ID = 'postId',
  USER_ID = 'userId',
  COMMENT_ID = 'commentId',
}

@ValidatorConstraint({ name: 'IsExistEntity', async: true })
@Injectable()
export class IsExistEntityValidator implements ValidatorConstraintInterface {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
    protected commentsRepository: CommentsRepository,
  ) {}

  async validate(id: IdTypes, args: ValidationArguments): Promise<boolean> {
    let result;

    try {
      switch (args.property) {
        case IdTypes.BLOG_ID: {
          result = await this.blogsRepository.findBlogById(id);
          break;
        }
        case IdTypes.POST_ID: {
          result = await this.postsRepository.findPostById(id);
          break;
        }
        case IdTypes.USER_ID: {
          result = await this.usersRepository.findUserById(id);
          break;
        }
        case IdTypes.COMMENT_ID: {
          result = await this.commentsRepository.findCommentById(id);
          break;
        }
      }

      return Boolean(result);
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Entity with such "${args.property}" doesn't exist!`;
  }
}

export function IsExistEntity(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsExistEntityValidator,
    });
  };
}
