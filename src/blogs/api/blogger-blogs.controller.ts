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
import { DeletePostCommand } from '../../posts/application/use-cases/delete-post.useCase';
import { UpdatePostCommand } from '../../posts/application/use-cases/update-post.useCase';
import { UpdatePostForBlogDto } from './dto/update-post-for-blog.dto';
import { QueryBloggerBlogsRepository } from '../infrastructure/query-blogger-blogs.repository';
import { CommentsQueryParamsDto } from '../../comments/api/dto/comments-query-params.dto';
import { AllBloggerCommentsOutputModel } from '../../comments/api/dto/comments-output-models.dto';
import { GetAllBloggerCommentsQuery } from '../../comments/application/use-cases/get-all-blogger-comments.useCase';

@Controller('blogger/blogs')
@UseGuards(AuthGuard)
export class BloggerBlogsController {
  constructor(
    private queryBlogsRepository: QueryBlogsRepository,
    private queryBloggerBlogsRepository: QueryBloggerBlogsRepository,
    private queryPostsRepository: QueryPostsRepository,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get()
  async findAllBlogsAsBlogger(
    @Query() query: BlogsQueryParamsDto,
    @User() user: UserDocument,
  ): Promise<AllBlogsOutputModel> {
    return this.queryBloggerBlogsRepository.findAllBlogsAsBlogger(
      query,
      String(user._id),
    );
  }

  @Get('comments')
  async findAllBloggerComments(
    @Query() queryParams: CommentsQueryParamsDto,
    @User() user: UserDocument,
  ): Promise<AllBloggerCommentsOutputModel> {
    return this.queryBus.execute(
      new GetAllBloggerCommentsQuery(queryParams, String(user.id)),
    );
  }

  @Post()
  async createBlog(
    @Body() creatingData: CreateBlogDto,
    @User() user: UserDocument,
  ): Promise<IBlogOutputModel> {
    const createdBlogId = await this.commandBus.execute(
      new CreateBlogCommand(creatingData, user),
    );

    return this.queryBlogsRepository.findBlogById(createdBlogId);
  }

  @Post(':blogId/posts')
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

  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ActionsOnBlogGuard)
  async deletePostSpecifiedBlog(
    @Param('postId', checkParamIdPipe) postId: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeletePostCommand(postId));
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

  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ActionsOnBlogGuard)
  async updatePostSpecifiedBlog(
    @Param('postId', checkParamIdPipe) postId: string,
    @Param('blogId', checkParamIdPipe) blogId: string,
    @Body() updatePostForBlogDto: UpdatePostForBlogDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdatePostCommand(postId, { ...updatePostForBlogDto, blogId }),
    );
  }
}
