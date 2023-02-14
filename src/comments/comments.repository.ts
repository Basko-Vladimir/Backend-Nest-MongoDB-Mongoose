import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from './schemas/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AllCommentsOutputModel } from './dto/comments-output-models.dto';
import { countSkipValue, getFilterByDbId, setSortValue } from '../common/utils';
import { CommentSortByField, SortDirection } from '../common/enums';
import { mapDbCommentToCommentOutputModel } from './mappers/comments-mapper';
import { Types } from 'mongoose';
import { CommentsQueryParamsDto } from './dto/comments-query-params.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) protected CommentModel: CommentModelType,
  ) {}

  async findComments(
    queryParams: CommentsQueryParamsDto,
    postId?: string,
  ): Promise<AllCommentsOutputModel> {
    const {
      sortBy = CommentSortByField.createdAt,
      sortDirection = SortDirection.desc,
      pageNumber = 1,
      pageSize = 10,
    } = queryParams;
    const filter = postId ? { postId: new Types.ObjectId(postId) } : {};
    const skip = countSkipValue(pageNumber, pageSize);
    const sortSetting = setSortValue(sortBy, sortDirection);
    const totalCount = await this.CommentModel.find(filter).countDocuments();
    const comments = await this.CommentModel.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort(sortSetting);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: comments.map(mapDbCommentToCommentOutputModel),
    };
  }

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
