import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from './schemas/post.schema';
import { PostsQueryParamsDto } from './dto/posts-query-params.dto';
import { AllPostOutputModel } from './dto/posts-output-models.dto';
import { countSkipValue, getFilterByDbId, setSortValue } from '../common/utils';
import { PostSortByField, SortDirection } from '../common/enums';
import { mapDbPostToPostOutputModel } from './mappers/posts-mapper';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) protected PostModel: PostModelType) {}

  async findAllPosts(
    queryParams: PostsQueryParamsDto,
    blogId?: string,
  ): Promise<AllPostOutputModel> {
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

  async findPostById(id: string): Promise<PostDocument> {
    const targetPost = await this.PostModel.findById(id);

    if (!targetPost) throw new NotFoundException();

    return targetPost;
  }

  async savePost(post: PostDocument): Promise<PostDocument> {
    return post.save();
  }

  async deletePost(id: string): Promise<void> {
    const { deletedCount } = await this.PostModel.deleteOne(
      getFilterByDbId(id),
    );

    if (!deletedCount) throw new NotFoundException();
  }
}
