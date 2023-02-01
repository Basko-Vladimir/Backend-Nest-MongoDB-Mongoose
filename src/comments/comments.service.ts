import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(protected commentsRepository: CommentsRepository) {}

  async findCommentById(id: string): Promise<CommentDocument> {
    return this.commentsRepository.findCommentById(id);
  }
}
