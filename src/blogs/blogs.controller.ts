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
import { BlogsService } from './application/blogs.service';
import { BlogsQueryParamsDto } from './dto/blogs-query-params.dto';
import {
  AllBlogsOutputModel,
  BlogAllFullPostsOutputModel,
  IBlogOutputModel,
} from './dto/blogs-output-models.dto';
import { mapDbBlogToBlogOutputModel } from './mappers/blogs-mappers';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { IFullPostOutputModel } from '../posts/dto/posts-output-models.dto';
import { PostsService } from '../posts/posts.service';
import {
  getFullPostOutputModel,
  mapDbPostToPostOutputModel,
} from '../posts/mappers/posts-mapper';
import { LikesService } from '../likes/likes.service';
import { PostsQueryParamsDto } from '../posts/dto/posts-query-params.dto';
import { checkParamIdPipe } from '../common/pipes/check-param-id-pipe.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { AddUserToRequestGuard } from '../common/guards/add-user-to-request.guard';
import { User } from '../common/decorators/user.decorator';
import { CreatePostForBlogDto } from './dto/create-post-for-blog.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogUseCommand } from './application/use-cases/create-blog.useCase';

@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    protected blogsService: BlogsService,
    protected postsService: PostsService,
    protected likesService: LikesService,
  ) {}

  @Get()
  async findAllBlogs(
    @Query() query: BlogsQueryParamsDto,
  ): Promise<AllBlogsOutputModel> {
    return this.blogsService.findAllBlogs(query);
  }

  @Get(':id')
  async findBlogById(
    @Param('id', checkParamIdPipe) blogId: string,
  ): Promise<IBlogOutputModel> {
    const targetBlog = await this.blogsService.findBlogById(blogId);
    return mapDbBlogToBlogOutputModel(targetBlog);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createBlog(
    @Body() creatingData: CreateBlogDto,
  ): Promise<IBlogOutputModel> {
    const createdBlog = await this.commandBus.execute(
      new CreateBlogUseCommand(creatingData),
    );

    return mapDbBlogToBlogOutputModel(createdBlog);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async deleteBlog(
    @Param('id', checkParamIdPipe) blogId: string,
  ): Promise<void> {
    return this.blogsService.deleteBlog(blogId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async updateBlog(
    @Param('id', checkParamIdPipe) blogId: string,
    @Body() updatingData: UpdateBlogDto,
  ): Promise<void> {
    return this.blogsService.updateBlog(blogId, updatingData);
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
