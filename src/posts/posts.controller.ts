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
import {
  AllPostOutputModel,
  PostOutputModel,
} from './dto/posts-output-models.dto';
import { mapDbPostToPostOutputModel } from './mappers/posts-mapper';

@Controller('posts')
export class PostsController {
  constructor(protected postsService: PostsService) {}

  @Get()
  async findAllPosts(
    @Query() queryParams: PostsQueryParamsDto,
  ): Promise<AllPostOutputModel> {
    return this.postsService.findAllPosts(queryParams);
  }

  @Get(':id')
  async findPostById(@Param('id') postId: string): Promise<PostOutputModel> {
    const targetPost = await this.postsService.findPostById(postId);
    return mapDbPostToPostOutputModel(targetPost);
  }

  @Post()
  async createPost(@Body() body: CreatePostDto): Promise<PostOutputModel> {
    const createdPost = await this.postsService.createPost(body);
    return mapDbPostToPostOutputModel(createdPost);
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
