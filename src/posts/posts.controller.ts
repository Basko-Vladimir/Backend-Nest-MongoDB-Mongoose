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
import {
  getFullPostOutputModel,
  mapDbPostToPostOutputModel,
} from './mappers/posts-mapper';
import { LikesService } from '../likes/likes.service';
import { BlogAllPostsOutputModel } from '../blogs/dto/blogs-output-models.dto';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected likesService: LikesService,
  ) {}

  @Get()
  async findAllPosts(
    @Query() queryParams: PostsQueryParamsDto,
  ): Promise<BlogAllPostsOutputModel> {
    const userId = null;
    const postsOutputModel = await this.postsService.findAllPosts(queryParams);

    const posts = postsOutputModel.items;
    const fullPosts = [];

    for (let i = posts.length - 1; i >= 0; i--) {
      const extendedPostLikesInfo =
        await this.likesService.getExtendedLikesInfo(posts[i].id, userId);
      fullPosts.push(getFullPostOutputModel(posts[i], extendedPostLikesInfo));
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
    const userId = null;
    const targetPost = await this.postsService.findPostById(postId);
    const postOutputModel = mapDbPostToPostOutputModel(targetPost);
    const extendedLikesInfo = await this.likesService.getExtendedLikesInfo(
      targetPost.id,
      userId,
    );

    return getFullPostOutputModel(postOutputModel, extendedLikesInfo);
  }

  @Post()
  async createPost(@Body() body: CreatePostDto): Promise<FullPostOutputModel> {
    const userId = null;
    const createdPost = await this.postsService.createPost(body);
    const postOutputModel = mapDbPostToPostOutputModel(createdPost);
    const extendedLikesInfo = await this.likesService.getExtendedLikesInfo(
      createdPost.id,
      userId,
    );

    return getFullPostOutputModel(postOutputModel, extendedLikesInfo);
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
