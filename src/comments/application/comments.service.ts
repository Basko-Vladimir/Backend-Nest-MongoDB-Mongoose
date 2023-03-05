import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentsRepository } from '../infrastructure/comments.repository';
import {
  CommentDocument,
  CommentModelType,
  Comment,
} from '../schemas/comment.schema';
import { AllCommentsOutputModel } from '../api/dto/comments-output-models.dto';
import { CommentsQueryParamsDto } from '../api/dto/comments-query-params.dto';
import { CreateCommentDto } from '../api/dto/create-comment.dto';
import { validateOrRejectInputDto } from '../../common/utils';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { UserDocument } from '../../users/schemas/user.schema';
import { LikeStatus } from '../../common/enums';
import { UpdateCommentDto } from '../api/dto/update-comment.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateLikeCommand } from '../../likes/application/use-cases/create-like.useCase';
import { UpdateLikeCommand } from '../../likes/application/use-cases/update-like.useCase';
import { LikesRepository } from '../../likes/infrastructure/likes.repository';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private likesRepository: LikesRepository,
    @InjectModel(Comment.name) protected CommentModel: CommentModelType,
    private commandBus: CommandBus,
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
    // await validateOrRejectInputDto(createCommentDto, CreateCommentDto);

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

  async deleteComment(commentId: string) {
    return this.commentsRepository.deleteComment(commentId);
  }

  async updateComment(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<void> {
    const targetComment = await this.commentsRepository.findCommentById(
      commentId,
    );
    const updatedComment = await targetComment.updateComment(
      updateCommentDto.content,
      targetComment,
    );

    await this.commentsRepository.saveComment(updatedComment);
  }

  async updateCommentLikeStatus(
    user: UserDocument,
    commentId: string,
    newStatus: LikeStatus,
  ): Promise<void> {
    const existingLike = await this.likesRepository.getLikeByFilter({
      userId: String(user._id),
      commentId,
    });

    if (existingLike) {
      return this.commandBus.execute(
        new UpdateLikeCommand(existingLike, newStatus),
      );
    } else {
      const targetComment = await this.commentsRepository.findCommentById(
        commentId,
      );
      await this.commandBus.execute(
        new CreateLikeCommand(
          user,
          String(targetComment.postId),
          newStatus,
          commentId,
        ),
      );
    }
  }
}
