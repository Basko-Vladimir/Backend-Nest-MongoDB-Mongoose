import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentsRepository } from '../../comments/infrastructure/comments.repository';
import { Types } from 'mongoose';
import { generateCustomBadRequestException } from '../utils';

@Injectable()
export class DeleteCommentGuard implements CanActivate {
  constructor(protected commentRepository: CommentsRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request<{ commentId: string }> = context
      .switchToHttp()
      .getRequest();
    const user = request.context.user;
    const validId = Types.ObjectId.isValid(request.params.commentId);

    if (!validId) {
      generateCustomBadRequestException('Invalid paramId', 'paramId');
    }

    const comment = await this.commentRepository.findCommentById(
      request.params.commentId,
    );

    if (String(comment.userId) !== String(user._id)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
