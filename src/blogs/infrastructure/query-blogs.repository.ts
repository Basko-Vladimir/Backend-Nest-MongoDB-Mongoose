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

  async findBlogById(blogId): Promise<IBlogOutputModel> {
    const targetBlog = await this.BlogModel.findById(blogId);

    if (!targetBlog) throw new NotFoundException();

    return mapDbBlogToBlogOutputModel(targetBlog);
  }

  private async getBlogsDataByQueryParams(
    queryParams: BlogsQueryParamsDto,
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

    const totalCount = await this.BlogModel.countDocuments().where(
      'name',
      new RegExp(searchNameTerm, 'i'),
    );
    const blogs = await this.BlogModel.find({})
      .where('name', new RegExp(searchNameTerm, 'i'))
      .skip(skip)
      .limit(pageSize)
      .sort(sortSetting);

    return { blogs, totalCount, pageNumber, pageSize };
  }
}
