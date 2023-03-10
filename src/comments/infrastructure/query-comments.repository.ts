import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../schemas/comment.schema';
import {
  AllCommentsOutputModel,
  ICommentOutputModel,
} from '../api/dto/comments-output-models.dto';
import { countSkipValue, setSortValue } from '../../common/utils';
import { CommentSortByField, SortDirection } from '../../common/enums';
import { mapDbCommentToCommentOutputModel } from '../mappers/comments-mapper';
import { CommentsQueryParamsDto } from '../api/dto/comments-query-params.dto';
import { User, UserDocument } from '../../users/schemas/user.schema';

@Injectable()
export class QueryCommentsRepository {
  constructor(
    @InjectModel(Comment.name) protected CommentModel: CommentModelType,
    @InjectModel(User.name) protected UserModel: CommentModelType,
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

  async findCommentById(id: string): Promise<ICommentOutputModel> {
    const targetComment = await this.CommentModel.findById(id);

    if (!targetComment) throw new NotFoundException();

    return mapDbCommentToCommentOutputModel(targetComment);
  }

  async findNotBannedUserCommentById(
    commentId: string,
    userId: string,
  ): Promise<ICommentOutputModel> {
    const user: UserDocument = await this.UserModel.findById(userId);

    if (!user || user.banInfo.isBanned) throw new NotFoundException();

    const targetComment = await this.CommentModel.findById(commentId);

    if (!targetComment) throw new NotFoundException();

    return mapDbCommentToCommentOutputModel(targetComment);
  }
}
