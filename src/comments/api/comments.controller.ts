import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { IFullCommentOutputModel } from './dto/comments-output-models.dto';
import {
  getFullCommentOutputModel,
  mapDbCommentToCommentOutputModel,
} from '../mappers/comments-mapper';
import { AuthGuard } from '../../common/guards/auth.guard';
import { checkParamIdPipe } from '../../common/pipes/check-param-id-pipe.service';
import { LikeStatusDto } from '../../likes/dto/like-status.dto';
import { User } from '../../common/decorators/user.decorator';
import { UserDocument } from '../../users/schemas/user.schema';
import { DeleteCommentGuard } from '../../common/guards/delete-comment.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AddUserToRequestGuard } from '../../common/guards/add-user-to-request.guard';
import { QueryLikesRepository } from '../../likes/infrastructure/query-likes.repository';
import { QueryCommentsRepository } from '../infrastructure/query-comments.repository';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private queryLikesRepository: QueryLikesRepository,
    private queryCommentsRepository: QueryCommentsRepository,
  ) {}

  @Get(':id')
  @UseGuards(AddUserToRequestGuard)
  async findCommentById(
    @Param('id') commentId: string,
    @User('_id') userId: string,
  ): Promise<IFullCommentOutputModel> {
    userId = userId ? String(userId) : null;
    const targetComment = await this.queryCommentsRepository.findCommentById(
      commentId,
    );
    const commentOutputModel = mapDbCommentToCommentOutputModel(targetComment);

    return getFullCommentOutputModel(
      commentOutputModel,
      this.queryLikesRepository,
      userId,
    );
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, DeleteCommentGuard)
  async deleteComment(
    @Param('commentId', checkParamIdPipe) commentId: string,
  ): Promise<void> {
    return await this.commentsService.deleteComment(commentId);
  }

  @Put(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, DeleteCommentGuard)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<void> {
    await this.commentsService.updateComment(commentId, updateCommentDto);
  }

  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async updateCommentLikeStatus(
    @Param('commentId', checkParamIdPipe) commentId: string,
    @Body() likeStatusDto: LikeStatusDto,
    @User() user: UserDocument,
  ): Promise<void> {
    await this.commentsService.updateCommentLikeStatus(
      user,
      commentId,
      likeStatusDto.likeStatus,
    );
  }
}
