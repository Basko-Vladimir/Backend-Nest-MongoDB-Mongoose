import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../schemas/post.schema';
import { PostsQueryParamsDto } from '../api/dto/posts-query-params.dto';
import {
  AllPostsOutputModel,
  IPostOutputModel,
} from '../api/dto/posts-output-models.dto';
import { countSkipValue, setSortValue } from '../../common/utils';
import { PostSortByField, SortDirection } from '../../common/enums';
import { mapDbPostToPostOutputModel } from '../mappers/posts-mapper';
import { Blog, BlogModelType } from '../../blogs/schemas/blog.schema';

@Injectable()
export class QueryPostsRepository {
  constructor(
    @InjectModel(Post.name) protected PostModel: PostModelType,
    @InjectModel(Blog.name) protected BlogModel: BlogModelType,
  ) {}

  async findAllPosts(
    queryParams: PostsQueryParamsDto,
    blogId?: string,
  ): Promise<AllPostsOutputModel> {
    const {
      pageSize = 10,
      pageNumber = 1,
      sortBy = PostSortByField.createdAt,
      sortDirection = SortDirection.desc,
    } = queryParams;
    const filter = blogId ? { blogId } : {};
    const skip = countSkipValue(pageNumber, pageSize);
    const sortSetting = setSortValue(sortBy, sortDirection);
    const totalCount = await this.PostModel.find(filter).countDocuments();
    const posts = await this.PostModel.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort(sortSetting);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: totalCount,
      items: posts.map(mapDbPostToPostOutputModel),
    };
  }

  async findPostById(id: string): Promise<IPostOutputModel> {
    const targetPost = await this.PostModel.findById(id);
    const relatedBlog = await this.BlogModel.findById(
      String(targetPost.blogId),
    );

    if (!targetPost || !relatedBlog || relatedBlog.banInfo.isBanned) {
      throw new NotFoundException();
    }

    return mapDbPostToPostOutputModel(targetPost);
  }
}
