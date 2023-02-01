import { Controller, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { FullCommentOutputModel } from './dto/comments-output-models.dto';
import {
  getFullCommentOutputModel,
  mapDbCommentToCommentOutputModel,
} from './mappers/comments-mapper';
import { LikesService } from '../likes/likes.service';

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
}
