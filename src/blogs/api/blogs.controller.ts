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
  BlogAllFullPostsOutputModel,
  IBlogOutputModel,
} from './dto/blogs-output-models.dto';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { IFullPostOutputModel } from '../../posts/api/dto/posts-output-models.dto';
import { PostsService } from '../../posts/application/posts.service';
import {
  getFullPostOutputModel,
  mapDbPostToPostOutputModel,
} from '../../posts/mappers/posts-mapper';
import { LikesService } from '../../likes/likes.service';
import { PostsQueryParamsDto } from '../../posts/api/dto/posts-query-params.dto';
import { checkParamIdPipe } from '../../common/pipes/check-param-id-pipe.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AddUserToRequestGuard } from '../../common/guards/add-user-to-request.guard';
import { User } from '../../common/decorators/user.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogUseCommand } from '../application/use-cases/create-blog.useCase';
import { DeleteBlogCommand } from '../application/use-cases/delete-blog.useCase';
import { UpdateBlogCommand } from '../application/use-cases/update-blog.useCase';
import { QueryBlogsRepository } from '../infrastructure/query-blogs.repository';
import { CreatePostForBlogDto } from './dto/create-post-for-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private postsService: PostsService,
    private likesService: LikesService,
    private queryBlogsRepository: QueryBlogsRepository,
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

  @Post()
  @UseGuards(AuthGuard)
  async createBlog(
    @Body() creatingData: CreateBlogDto,
  ): Promise<IBlogOutputModel> {
    const createdBlogId = await this.commandBus.execute(
      new CreateBlogUseCommand(creatingData),
    );

    return this.queryBlogsRepository.findBlogById(createdBlogId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async deleteBlog(
    @Param('id', checkParamIdPipe) blogId: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteBlogCommand(blogId));
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async updateBlog(
    @Param('id', checkParamIdPipe) blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateBlogCommand(blogId, updateBlogDto),
    );
  }

  @Get(':blogId/posts')
  @UseGuards(AddUserToRequestGuard)
  async findAllPostsByBlogId(
    @Query() queryParams: PostsQueryParamsDto,
    @Param('blogId', checkParamIdPipe) blogId: string,
    @User('_id') userId: string,
  ): Promise<BlogAllFullPostsOutputModel> {
    userId = userId ? String(userId) : null;
    const postsOutputModel = await this.postsService.findPosts(
      queryParams,
      blogId,
    );
    const posts = postsOutputModel.items;
    const fullPosts = [];

    for (let i = 0; i < posts.length; i++) {
      fullPosts.push(
        await getFullPostOutputModel(posts[i], this.likesService, userId),
      );
    }

    return {
      ...postsOutputModel,
      items: fullPosts,
    };
  }

  @Post(':blogId/posts')
  @UseGuards(AuthGuard)
  async createPostForBlog(
    @Param('blogId', checkParamIdPipe) blogId: string,
    @Body() createPostForBlogDto: CreatePostForBlogDto,
    @User('_id') userId: string,
  ): Promise<IFullPostOutputModel> {
    const createdPost = await this.postsService.createPost({
      ...createPostForBlogDto,
      blogId,
    });
    const postOutputModel = mapDbPostToPostOutputModel(createdPost);
    return await getFullPostOutputModel(
      postOutputModel,
      this.likesService,
      userId,
    );
  }
}
