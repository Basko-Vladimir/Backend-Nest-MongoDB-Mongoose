import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { BlogsQueryParamsDto } from './dto/blogs-query-params.dto';
import {
  AllBlogsOutputModel,
  BlogAllFullPostsOutputModel,
  IBlogOutputModel,
} from './dto/blogs-output-models.dto';
import { PostsQueryParamsDto } from '../../posts/api/dto/posts-query-params.dto';
import { checkParamIdPipe } from '../../common/pipes/check-param-id-pipe.service';
import { AddUserToRequestGuard } from '../../common/guards/add-user-to-request.guard';
import { User } from '../../common/decorators/user.decorator';
import { QueryBlogsRepository } from '../infrastructure/query-blogs.repository';
import { QueryPostsRepository } from '../../posts/infrastructure/query-posts.repository';
import { GetAllFullPostsQuery } from '../../posts/application/use-cases/get-all-full-posts.useCase';

@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private queryBlogsRepository: QueryBlogsRepository,
    private queryPostsRepository: QueryPostsRepository,
  ) {}

  @Get()
  async findAllBlogs(
    @Query() query: BlogsQueryParamsDto,
  ): Promise<AllBlogsOutputModel> {
    return this.queryBlogsRepository.findAllBlogs(query);
  }

  @Get(':id')
  async findBlogById(
    @Param('id', checkParamIdPipe) blogId: string,
  ): Promise<IBlogOutputModel> {
    return this.queryBlogsRepository.findBlogById(blogId);
  }

  @Get(':blogId/posts')
  @UseGuards(AddUserToRequestGuard)
  async findAllPostsByBlogId(
    @Query() queryParams: PostsQueryParamsDto,
    @Param('blogId', checkParamIdPipe) blogId: string,
    @User('_id') userId: string,
  ): Promise<BlogAllFullPostsOutputModel> {
    userId = userId ? String(userId) : null;
    const allPostsOutputModel = await this.queryPostsRepository.findAllPosts(
      queryParams,
      blogId,
    );

    return this.queryBus.execute(
      new GetAllFullPostsQuery(allPostsOutputModel, userId),
    );
  }
}
