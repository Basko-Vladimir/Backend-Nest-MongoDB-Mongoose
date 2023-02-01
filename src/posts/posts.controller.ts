import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsQueryParamsDto } from './dto/posts-query-params.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FullPostOutputModel } from './dto/posts-output-models.dto';
import { getFullPostOutputModel } from './mappers/posts-mapper';
import { LikesService } from '../likes/likes.service';
import { BlogAllFullPostsOutputModel } from '../blogs/dto/blogs-output-models.dto';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected likesService: LikesService,
  ) {}

  @Get()
  async findPosts(
    @Query() queryParams: PostsQueryParamsDto,
  ): Promise<BlogAllFullPostsOutputModel> {
    const postsOutputModel = await this.postsService.findPosts(queryParams);
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

  @Get(':id')
  async findPostById(
    @Param('id') postId: string,
  ): Promise<FullPostOutputModel> {
    const targetPost = await this.postsService.findPostById(postId);
    return getFullPostOutputModel(targetPost, this.likesService);
  }

  @Post()
  async createPost(@Body() body: CreatePostDto): Promise<FullPostOutputModel> {
    const createdPost = await this.postsService.createPost(body);
    return getFullPostOutputModel(createdPost, this.likesService);
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') postId: string): Promise<void> {
    return this.postsService.deletePost(postId);
  }

  @Put(':id')
  @HttpCode(204)
  async updatePost(
    @Param('id') postId: string,
    @Body() body: UpdatePostDto,
  ): Promise<void> {
    return this.postsService.updatePost(postId, body);
  }
}
