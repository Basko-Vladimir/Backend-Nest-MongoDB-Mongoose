import { Injectable } from '@nestjs/common';
import { BlogsQueryParamsDto } from '../api/dto/blogs-query-params.dto';
import { AllBlogsOutputModel } from '../api/dto/blogs-output-models.dto';
import { QueryBlogsRepository } from './query-blogs.repository';
import { mapDbBlogToBlogOutputModel } from '../mappers/blogs-mappers';

@Injectable()
export class QueryBloggerBlogsRepository extends QueryBlogsRepository {
  async findAllBlogsAsBlogger(
    queryParams: BlogsQueryParamsDto,
    userId: string,
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
}
