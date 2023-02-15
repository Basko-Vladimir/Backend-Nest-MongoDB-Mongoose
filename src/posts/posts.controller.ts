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
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsQueryParamsDto } from './dto/posts-query-params.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IFullPostOutputModel } from './dto/posts-output-models.dto';
import {
  getFullPostOutputModel,
  mapDbPostToPostOutputModel,
} from './mappers/posts-mapper';
import { LikesService } from '../likes/likes.service';
import { BlogAllFullPostsOutputModel } from '../blogs/dto/blogs-output-models.dto';
import { CommentsService } from '../comments/comments.service';
import { CommentsQueryParamsDto } from '../comments/dto/comments-query-params.dto';
import {
  AllCommentsOutputModel,
  FullCommentOutputModel,
} from '../comments/dto/comments-output-models.dto';
import {
  getFullCommentOutputModel,
  mapDbCommentToCommentOutputModel,
} from '../comments/mappers/comments-mapper';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';
import { UserDocument } from '../users/schemas/user.schema';
import { LikeStatusDto } from '../likes/dto/like-status.dto';
import { AddUserToRequestGuard } from '../common/guards/add-user-to-request.guard';
import { CreateCommentForPostDto } from './dto/create-comment-for-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected likesService: LikesService,
    protected commentsService: CommentsService,
  ) {}

  @Get()
  @UseGuards(AddUserToRequestGuard)
  async findPosts(
    @Query() queryParams: PostsQueryParamsDto,
    @User('_id') userId: string,
  ): Promise<BlogAllFullPostsOutputModel> {
    userId = userId ? String(userId) : null;
    const postsOutputModel = await this.postsService.findPosts(queryParams);
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

  @Get(':postId/comments')
  @UseGuards(AddUserToRequestGuard)
  async getCommentsForPost(
    @Param('postId', ParseObjectIdPipe) postId: string,
    @Query() queryParams: CommentsQueryParamsDto,
    @User('_id') userId: string,
  ): Promise<AllCommentsOutputModel> {
    await this.postsService.findPostById(postId);
    userId = userId ? String(userId) : null;
    const commentsOutputModel = await this.commentsService.findComments(
      queryParams,
      postId,
    );
    const comments = commentsOutputModel.items;
    const fullComments = [];

    for (let i = 0; i < comments.length; i++) {
      fullComments.push(
        await getFullCommentOutputModel(comments[i], this.likesService, userId),
      );
    }

    return {
      ...commentsOutputModel,
      items: fullComments,
    };
  }

  @Get(':id')
  @UseGuards(AddUserToRequestGuard)
  async findPostById(
    @Param('id', ParseObjectIdPipe) postId: string,
    @User('_id') userId: string,
  ): Promise<IFullPostOutputModel> {
    userId = userId ? String(userId) : null;
    const targetPost = await this.postsService.findPostById(postId);
    const postOutputModel = mapDbPostToPostOutputModel(targetPost);
    return getFullPostOutputModel(postOutputModel, this.likesService, userId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createPost(
    @Body() body: CreatePostDto,
    @User('_id') userId: string,
  ): Promise<IFullPostOutputModel> {
    const createdPost = await this.postsService.createPost(body);
    const postOutputModel = mapDbPostToPostOutputModel(createdPost);
    return getFullPostOutputModel(postOutputModel, this.likesService, userId);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async deletePost(
    @Param('id', ParseObjectIdPipe) postId: string,
  ): Promise<void> {
    await this.postsService.findPostById(postId);
    return this.postsService.deletePost(postId);
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async updatePost(
    @Param('id', ParseObjectIdPipe) postId: string,
    @Body() body: UpdatePostDto,
  ): Promise<void> {
    await this.postsService.findPostById(postId);
    return this.postsService.updatePost(postId, body);
  }

  @Post(':postId/comments')
  @UseGuards(AuthGuard)
  async createCommentForPost(
    @Param('postId', ParseObjectIdPipe) postId: string,
    @Body() createCommentForPostDto: CreateCommentForPostDto,
    @User() user: UserDocument,
  ): Promise<FullCommentOutputModel> {
    await this.postsService.findPostById(postId);
    const createdComment = await this.commentsService.createComment({
      postId,
      content: createCommentForPostDto.content,
      userId: user.id,
      userLogin: user.login,
    });
    const commentOutputModel = mapDbCommentToCommentOutputModel(createdComment);

    return getFullCommentOutputModel(
      commentOutputModel,
      this.likesService,
      String(user._id),
    );
  }

  @Put(':postId/like-status')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async updatePostLikeStatus(
    @Param('postId', ParseObjectIdPipe) postId: string,
    @Body() likeStatusDto: LikeStatusDto,
    @User() user: UserDocument,
  ): Promise<void> {
    const { likeStatus } = likeStatusDto;
    await this.postsService.findPostById(postId);
    await this.postsService.updatePostLikeStatus(user, postId, likeStatus);
  }
}
