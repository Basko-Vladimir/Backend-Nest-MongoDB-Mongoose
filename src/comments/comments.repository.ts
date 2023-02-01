import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from './schemas/comment.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) protected CommentModel: CommentModelType,
  ) {}

  async findCommentById(id: string): Promise<CommentDocument> {
    const targetComment = await this.CommentModel.findById(id);

    if (!targetComment) throw new NotFoundException();

    return targetComment;
  }
}
