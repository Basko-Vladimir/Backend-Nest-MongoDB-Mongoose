import { Injectable } from '@nestjs/common';
import { BlogsQueryParamsDto } from '../api/dto/blogs-query-params.dto';

import { AllBlogsForAdminOutputModel } from '../api/dto/blogs-output-models.dto';
import { mapDbBlogToBlogForAdminOutputModel } from '../mappers/blogs-mappers';
import { QueryBlogsRepository } from './query-blogs.repository';

@Injectable()
export class QueryAdminBlogsRepository extends QueryBlogsRepository {
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
}
