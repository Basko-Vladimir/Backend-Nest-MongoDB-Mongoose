import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../schemas/comment.schema';
import { AllCommentsOutputModel } from '../api/dto/comments-output-models.dto';
import { countSkipValue, setSortValue } from '../../common/utils';
import { CommentSortByField, SortDirection } from '../../common/enums';
import { mapDbCommentToCommentOutputModel } from '../mappers/comments-mapper';
import { CommentsQueryParamsDto } from '../api/dto/comments-query-params.dto';

@Injectable()
export class QueryCommentsRepository {
  constructor(
    @InjectModel(Comment.name) protected CommentModel: CommentModelType,
  ) {}

  async findAllComments(
    queryParams: CommentsQueryParamsDto,
    postId?: string,
  ): Promise<AllCommentsOutputModel> {
    const {
      sortBy = CommentSortByField.createdAt,
      sortDirection = SortDirection.desc,
      pageNumber = 1,
      pageSize = 10,
    } = queryParams;
    const filter = postId ? { postId } : {};
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
}
