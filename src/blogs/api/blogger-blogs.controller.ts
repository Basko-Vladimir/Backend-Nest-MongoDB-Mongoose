import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryParamsDto } from './dto/blogs-query-params.dto';
import {
  AllBlogsOutputModel,
  IBlogOutputModel,
} from './dto/blogs-output-models.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserDocument } from '../../users/schemas/user.schema';
import { User } from '../../common/decorators/user.decorator';
import { QueryBlogsRepository } from '../infrastructure/query-blogs.repository';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CreateBlogCommand } from '../application/use-cases/create-blog.useCase';
import { checkParamIdPipe } from '../../common/pipes/check-param-id-pipe.service';
import { CreatePostForBlogDto } from './dto/create-post-for-blog.dto';
import { IFullPostOutputModel } from '../../posts/api/dto/posts-output-models.dto';
import { CreatePostCommand } from '../../posts/application/use-cases/create-post.useCase';
import { GetFullPostQuery } from '../../posts/application/use-cases/get-full-post.useCase';
import { QueryPostsRepository } from '../../posts/infrastructure/query-posts.repository';
import { DeleteBlogCommand } from '../application/use-cases/delete-blog.useCase';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { UpdateBlogCommand } from '../application/use-cases/update-blog.useCase';
import { ActionsOnBlogGuard } from '../../common/guards/actions-on-blog.guard';

@Controller('blogger/blogs')
@UseGuards(AuthGuard)
export class BloggerBlogsController {
  constructor(
    private queryBlogsRepository: QueryBlogsRepository,
    private queryPostsRepository: QueryPostsRepository,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get()
  async findAllBlogsAsBlogger(
    @Query() query: BlogsQueryParamsDto,
    @User() user: UserDocument,
  ): Promise<AllBlogsOutputModel> {
    return this.queryBlogsRepository.findAllBlogsAsBlogger(query, user._id);
  }

  @Post()
  async createBlog(
    @Body() creatingData: CreateBlogDto,
  ): Promise<IBlogOutputModel> {
    const createdBlogId = await this.commandBus.execute(
      new CreateBlogCommand(creatingData),
    );

    return this.queryBlogsRepository.findBlogById(createdBlogId);
  }

  @Post(':blogId/posts')
  @UseGuards(ActionsOnBlogGuard)
  async createPostForBlog(
    @Param('blogId', checkParamIdPipe) blogId: string,
    @Body() createPostForBlogDto: CreatePostForBlogDto,
    @User('_id') userId: string,
  ): Promise<IFullPostOutputModel> {
    const createdPostId = await this.commandBus.execute(
      new CreatePostCommand({
        ...createPostForBlogDto,
        blogId,
      }),
    );
    const postOutputModel = await this.queryPostsRepository.findPostById(
      createdPostId,
    );

    return this.queryBus.execute(new GetFullPostQuery(postOutputModel, userId));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ActionsOnBlogGuard)
  async deleteBlog(
    @Param('id', checkParamIdPipe) blogId: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteBlogCommand(blogId));
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ActionsOnBlogGuard)
  async updateBlog(
    @Param('id', checkParamIdPipe) blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateBlogCommand(blogId, updateBlogDto),
    );
  }
}
