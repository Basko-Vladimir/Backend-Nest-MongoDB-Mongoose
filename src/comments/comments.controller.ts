import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { FullCommentOutputModel } from './dto/comments-output-models.dto';
import {
  getFullCommentOutputModel,
  mapDbCommentToCommentOutputModel,
} from './mappers/comments-mapper';
import { LikesService } from '../likes/likes.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { LikeStatusDto } from '../likes/dto/like-status.dto';
import { User } from '../common/decorators/user.decorator';
import { UserDocument } from '../users/schemas/user.schema';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected likesService: LikesService,
  ) {}

  @Get(':id')
  async findCommentById(
    @Param('id') commentId: string,
  ): Promise<FullCommentOutputModel> {
    const targetComment = await this.commentsService.findCommentById(commentId);
    const commentOutputModel = mapDbCommentToCommentOutputModel(targetComment);
    return getFullCommentOutputModel(commentOutputModel, this.likesService);
  }

  @Put(':commentId/like-status')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async updateCommentLikeStatus(
    @Param('commentId', ParseObjectIdPipe) commentId: string,
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
