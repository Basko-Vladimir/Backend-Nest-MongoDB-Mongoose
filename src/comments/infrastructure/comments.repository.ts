import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../schemas/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { getFilterByDbId } from '../../common/utils';

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

  async deleteComment(id: string): Promise<void> {
    const { deletedCount } = await this.CommentModel.deleteOne(
      getFilterByDbId(id),
    );

    if (!deletedCount) throw new NotFoundException();
  }

  async saveComment(comment: CommentDocument): Promise<CommentDocument> {
    return comment.save();
  }
}
