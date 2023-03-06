import { Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsQueryParamsDto } from '../api/dto/blogs-query-params.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../schemas/blog.schema';
import { BlogSortByField, SortDirection } from '../../common/enums';
import { countSkipValue, setSortValue } from '../../common/utils';
import {
  AllBlogsForAdminOutputModel,
  AllBlogsOutputModel,
  IBlogOutputModel,
} from '../api/dto/blogs-output-models.dto';
import {
  mapDbBlogToBlogForAdminOutputModel,
  mapDbBlogToBlogOutputModel,
} from '../mappers/blogs-mappers';

interface IBlogsDataByQueryParams {
  blogs: BlogDocument[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
}

@Injectable()
export class QueryBlogsRepository {
  constructor(@InjectModel(Blog.name) protected BlogModel: BlogModelType) {}

  async findAllBlogs(
    queryParams: BlogsQueryParamsDto,
  ): Promise<AllBlogsOutputModel> {
    const { blogs, totalCount, pageNumber, pageSize } =
      await this.getBlogsDataByQueryParams(queryParams);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount,
      items: blogs.map(mapDbBlogToBlogOutputModel),
    };
  }

  async findAllBlogsAsAdmin(
    queryParams: BlogsQueryParamsDto,
  ): Promise<AllBlogsForAdminOutputModel> {
    const { blogs, totalCount, pageNumber, pageSize } =
      await this.getBlogsDataByQueryParams(queryParams);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount,
      items: blogs.map(mapDbBlogToBlogForAdminOutputModel),
    };
  }

  async findAllBlogsAsBlogger(
    queryParams: BlogsQueryParamsDto,
    userId: Types.ObjectId,
  ): Promise<AllBlogsOutputModel> {
    const { blogs, totalCount, pageNumber, pageSize } =
      await this.getBlogsDataByQueryParams(queryParams, userId);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount,
      items: blogs.map(mapDbBlogToBlogOutputModel),
    };
  }

  async findBlogById(blogId): Promise<IBlogOutputModel> {
    const targetBlog = await this.BlogModel.findById(blogId);

    if (!targetBlog) throw new NotFoundException();

    return mapDbBlogToBlogOutputModel(targetBlog);
  }

  private async getBlogsDataByQueryParams(
    queryParams: BlogsQueryParamsDto,
    userId?: Types.ObjectId,
  ): Promise<IBlogsDataByQueryParams> {
    const {
      sortBy = BlogSortByField.createdAt,
      sortDirection = SortDirection.desc,
      pageNumber = 1,
      pageSize = 10,
      searchNameTerm = '',
    } = queryParams;
    const skip = countSkipValue(pageNumber, pageSize);
    const sortSetting = setSortValue(sortBy, sortDirection);
    const filterItems: object[] = [];

    if (searchNameTerm) {
      filterItems.push({ name: new RegExp(searchNameTerm, 'i') });
    }
    if (userId) {
      filterItems.push({ ['blogOwnerInfo.ownerId']: userId });
    }

    const filter = { $or: filterItems };
    const totalCount = await this.BlogModel.find(filter).countDocuments();
    const blogs = await this.BlogModel.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort(sortSetting);

    return { blogs, totalCount, pageNumber, pageSize };
  }
}
