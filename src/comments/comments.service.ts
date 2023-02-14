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
import { PostsRepository } from '../posts/posts.repository';
import { UserDocument } from '../users/schemas/user.schema';
import { LikeStatus } from '../common/enums';
import { LikesService } from '../likes/likes.service';

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsRepository,
    protected likeService: LikesService,
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

  async updateCommentLikeStatus(
    user: UserDocument,
    commentId: string,
    newStatus: LikeStatus,
  ): Promise<void> {
    const existingLike = await this.likeService.getLikeByFilter({
      userId: String(user._id),
      commentId,
    });

    if (existingLike) {
      return this.likeService.updateLike(existingLike, newStatus);
    } else {
      const targetComment = await this.commentsRepository.findCommentById(
        commentId,
      );
      await this.likeService.createLike(
        user,
        String(targetComment.postId),
        newStatus,
        commentId,
      );
    }
  }
}
