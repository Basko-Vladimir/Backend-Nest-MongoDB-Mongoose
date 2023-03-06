import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BlogsQueryParamsDto } from './dto/blogs-query-params.dto';
import { AllBlogsOutputModel } from './dto/blogs-output-models.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UserDocument } from '../../users/schemas/user.schema';
import { User } from '../../common/decorators/user.decorator';
import { QueryBlogsRepository } from '../infrastructure/query-blogs.repository';

@Controller('blogger/blogs')
export class BloggerBlogsController {
  constructor(
    private queryBlogsRepository: QueryBlogsRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAllBlogsAsBlogger(
    @Query() query: BlogsQueryParamsDto,
    @User() user: UserDocument,
  ): Promise<AllBlogsOutputModel> {
    return this.queryBlogsRepository.findAllBlogsAsBlogger(query, user._id);
  }
}
