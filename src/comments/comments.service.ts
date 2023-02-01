import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CommentDocument } from './schemas/comment.schema';
import { AllCommentsOutputModel } from './dto/comments-output-models.dto';
import { PostsQueryParamsDto } from '../posts/dto/posts-query-params.dto';

@Injectable()
export class CommentsService {
  constructor(protected commentsRepository: CommentsRepository) {}

  async findComments(
    queryParams: PostsQueryParamsDto,
    postId?: string,
  ): Promise<AllCommentsOutputModel> {
    return this.commentsRepository.findComments(queryParams, postId);
  }

  async findCommentById(id: string): Promise<CommentDocument> {
    return this.commentsRepository.findCommentById(id);
  }
}
