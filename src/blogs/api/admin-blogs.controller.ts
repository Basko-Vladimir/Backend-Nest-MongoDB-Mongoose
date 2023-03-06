import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { BlogsQueryParamsDto } from './dto/blogs-query-params.dto';
import { AllBlogsForAdminOutputModel } from './dto/blogs-output-models.dto';
import { QueryBlogsRepository } from '../infrastructure/query-blogs.repository';

@Controller('sa/blogs')
export class AdminBlogsController {
  constructor(private queryBlogsRepository: QueryBlogsRepository) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAllBlogsAsAdmin(
    @Query() query: BlogsQueryParamsDto,
  ): Promise<AllBlogsForAdminOutputModel> {
    return this.queryBlogsRepository.findAllBlogsAsAdmin(query);
  }
}
