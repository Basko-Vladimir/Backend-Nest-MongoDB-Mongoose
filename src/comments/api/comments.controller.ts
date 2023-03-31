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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ICommentWithLikeInfoOutputModel } from './dto/comments-output-models.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { checkParamIdPipe } from '../../common/pipes/check-param-id-pipe.service';
import { LikeStatusDto } from '../../likes/dto/like-status.dto';
import { User } from '../../common/decorators/user.decorator';
import { UserDocument } from '../../users/schemas/user.schema';
import { DeleteCommentGuard } from '../../common/guards/delete-comment.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AddUserToRequestGuard } from '../../common/guards/add-user-to-request.guard';
import { QueryCommentsRepository } from '../infrastructure/query-comments.repository';
import { DeleteCommentCommand } from '../application/use-cases/delete-comment.useCase';
import { UpdateCommentCommand } from '../application/use-cases/update-comment.useCase';
import { UpdateCommentLikeStatusCommand } from '../application/use-cases/update-comment-like-status.useCase';
import { GetFullCommentQuery } from '../application/use-cases/get-full-comment.useCase';

@Controller('comments')
export class CommentsController {
  constructor(
    private queryCommentsRepository: QueryCommentsRepository,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(':id')
  @UseGuards(AddUserToRequestGuard)
  async findCommentById(
    @Param('id') commentId: string,
    @User('_id') userId: string,
  ): Promise<ICommentWithLikeInfoOutputModel> {
    userId = userId ? String(userId) : null;
    const commentOutputModel =
      await this.queryCommentsRepository.findNotBannedUserCommentById(
        commentId,
      );

    return this.queryBus.execute(
      new GetFullCommentQuery(commentOutputModel, userId),
    );
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, DeleteCommentGuard)
  async deleteComment(
    @Param('commentId', checkParamIdPipe) commentId: string,
  ): Promise<void> {
    return await this.commandBus.execute(new DeleteCommentCommand(commentId));
  }

  @Put(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, DeleteCommentGuard)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateCommentCommand(commentId, updateCommentDto),
    );
  }

  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async updateCommentLikeStatus(
    @Param('commentId', checkParamIdPipe) commentId: string,
    @Body() likeStatusDto: LikeStatusDto,
    @User() user: UserDocument,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateCommentLikeStatusCommand(
        user,
        commentId,
        likeStatusDto.likeStatus,
      ),
    );
  }
}
