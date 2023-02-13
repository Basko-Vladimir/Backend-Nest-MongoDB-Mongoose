import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentsRepository } from './comments.repository';
import {
  CommentDocument,
  CommentModelType,
  Comment,
} from './schemas/comment.schema';
import { AllCommentsOutputModel } from './dto/comments-output-models.dto';
import { CommentsQueryParamsDto } from './dto/comments-query-params.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { validateOrRejectInputDto } from '../common/utils';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsRepository,
    @InjectModel(Comment.name) protected CommentModel: CommentModelType,
  ) {}

  async findComments(
    queryParams: CommentsQueryParamsDto,
    postId?: string,
  ): Promise<AllCommentsOutputModel> {
    return this.commentsRepository.findComments(queryParams, postId);
  }

  async findCommentById(id: string): Promise<CommentDocument> {
    return this.commentsRepository.findCommentById(id);
  }

  async createComment(
    createCommentDto: CreateCommentDto,
  ): Promise<CommentDocument> {
    await validateOrRejectInputDto(createCommentDto, CreateCommentDto);

    const targetPost = await this.postsRepository.findPostById(
      createCommentDto.postId,
    );

    if (!targetPost) throw new NotFoundException();

    const createdComment = this.CommentModel.createCommentEntity(
      createCommentDto,
      this.CommentModel,
    );

    return this.commentsRepository.saveComment(createdComment);
  }
}
