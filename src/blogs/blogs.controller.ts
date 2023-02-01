import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsQueryParamsDto } from './dto/blogs-query-params.dto';
import {
  AllBlogsOutputModel,
  BlogAllFullPostsOutputModel,
  IBlogOutputModel,
} from './dto/blogs-output-models.dto';
import { mapDbBlogToBlogOutputModel } from './mappers/blogs-mappers';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { FullPostOutputModel } from '../posts/dto/posts-output-models.dto';
import { PostsService } from '../posts/posts.service';
import { getFullPostOutputModel } from '../posts/mappers/posts-mapper';
import { LikesService } from '../likes/likes.service';
import { PostsQueryParamsDto } from '../posts/dto/posts-query-params.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
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
  async findBlogById(@Param('id') blogId: string): Promise<IBlogOutputModel> {
    const targetBlog = await this.blogsService.findBlogById(blogId);
    return mapDbBlogToBlogOutputModel(targetBlog);
  }

  @Post()
  async createBlog(
    @Body() creatingData: CreateBlogDto,
  ): Promise<IBlogOutputModel> {
    const createdBlog = await this.blogsService.createBlog(creatingData);

    return mapDbBlogToBlogOutputModel(createdBlog);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') blogId: string): Promise<void> {
    return this.blogsService.deleteBlog(blogId);
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() updatingData: UpdateBlogDto,
  ): Promise<void> {
    return this.blogsService.updateBlog(blogId, updatingData);
  }

  @Get(':id/posts')
  async findAllPostsByBlogId(
    @Query() queryParams: PostsQueryParamsDto,
    @Param('id') blogId: string,
  ): Promise<BlogAllFullPostsOutputModel> {
    const targetBlog = await this.findBlogById(blogId);

    if (!targetBlog) throw new NotFoundException();

    const postsOutputModel = await this.postsService.findPosts(
      queryParams,
      blogId,
    );
    const posts = postsOutputModel.items;
    const fullPosts = [];

    for (let i = posts.length - 1; i >= 0; i--) {
      fullPosts.push(await getFullPostOutputModel(posts[i], this.likesService));
    }

    return {
      ...postsOutputModel,
      items: fullPosts,
    };
  }

  @Post(':id/posts')
  async createPostForBlog(
    @Param('id') blogId: string,
    @Body() creatingData: Omit<CreatePostDto, 'blogId'>,
  ): Promise<FullPostOutputModel> {
    const createdPost = await this.postsService.createPost({
      ...creatingData,
      blogId,
    });

    return await getFullPostOutputModel(createdPost, this.likesService);
  }
}
