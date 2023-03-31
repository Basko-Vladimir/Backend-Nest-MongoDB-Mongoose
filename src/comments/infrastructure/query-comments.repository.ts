import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../schemas/comment.schema';
import {
  AllBloggerCommentsOutputModel,
  AllCommentsOutputModel,
  IBloggerCommentOutputModel,
  ICommentOutputModel,
} from '../api/dto/comments-output-models.dto';
import {
  mapDbCommentToCommentOutputModel,
  mapDbCommentToBloggerCommentOutputModel,
} from '../mappers/comments-mapper';
import { countSkipValue, setSortValue } from '../../common/utils';
import { CommentSortByField, SortDirection } from '../../common/enums';
import { CommentsQueryParamsDto } from '../api/dto/comments-query-params.dto';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { UpdateOrFilterModel } from '../../common/types';
import { PostDocument } from '../../posts/schemas/post.schema';
import { QueryLikesRepository } from '../../likes/infrastructure/query-likes.repository';

interface ICommentsDataByFilters {
  comments: CommentDocument[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
}

@Injectable()
export class QueryCommentsRepository {
  constructor(
    @InjectModel(Comment.name) protected CommentModel: CommentModelType,
    @InjectModel(User.name) protected UserModel: CommentModelType,
    protected queryLikesRepository: QueryLikesRepository,
  ) {}

  async findAllComments(
    queryParams: CommentsQueryParamsDto,
    postId?: string,
  ): Promise<AllCommentsOutputModel> {
    const { pageSize, pageNumber, comments, totalCount } =
      await this.getCommentsDataByFilters(
        queryParams,
        postId ? { postId } : {},
      );

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: comments.map(mapDbCommentToCommentOutputModel),
    };
  }

  async findAllBloggerComments(
    queryParams: CommentsQueryParamsDto,
    posts: PostDocument[],
    userId: string,
  ): Promise<AllBloggerCommentsOutputModel> {
    const postsIds = posts.map((post) => String(post._id));
    const { pageSize, pageNumber, comments, totalCount } =
      await this.getCommentsDataByFilters(
        queryParams,
        postsIds.length ? { postId: { $in: postsIds } } : {},
      );

    const bloggerComments: IBloggerCommentOutputModel[] = [];

    for (let i = 0; i < comments.length; i++) {
      const currentComment = mapDbCommentToCommentOutputModel(comments[i]);
      const likesInfo = await this.queryLikesRepository.getLikesInfo(
        userId,
        String(comments[i]._id),
      );
      const currentPost = posts.find(
        (post) => String(post._id) === String(comments[i].postId),
      );

      bloggerComments.push(
        mapDbCommentToBloggerCommentOutputModel(
          currentComment,
          currentPost,
          likesInfo,
        ),
      );
    }

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: bloggerComments,
    };
  }

  async findCommentById(id: string): Promise<ICommentOutputModel> {
    const targetComment = await this.CommentModel.findById(id);

    if (!targetComment) throw new NotFoundException();

    return mapDbCommentToCommentOutputModel(targetComment);
  }

  async findNotBannedUserCommentById(
    commentId: string,
  ): Promise<ICommentOutputModel> {
    const targetComment = await this.CommentModel.findById(commentId);

    if (!targetComment) throw new NotFoundException();

    const user: UserDocument = await this.UserModel.findById(
      String(targetComment.userId),
    );

    if (!user || user.banInfo.isBanned) throw new NotFoundException();

    return mapDbCommentToCommentOutputModel(targetComment);
  }

  private async getCommentsDataByFilters(
    queryParams: CommentsQueryParamsDto,
    filter: UpdateOrFilterModel,
  ): Promise<ICommentsDataByFilters> {
    const {
      sortBy = CommentSortByField.createdAt,
      sortDirection = SortDirection.desc,
      pageNumber = 1,
      pageSize = 10,
    } = queryParams;

    const skip = countSkipValue(pageNumber, pageSize);
    const sortSetting = setSortValue(sortBy, sortDirection);
    const totalCount = await this.CommentModel.find(filter).countDocuments();
    const comments = await this.CommentModel.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort(sortSetting);

    return {
      comments,
      totalCount,
      pageNumber,
      pageSize,
    };
  }
}
