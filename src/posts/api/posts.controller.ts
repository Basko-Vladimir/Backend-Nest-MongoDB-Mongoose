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
import { CommandBus } from '@nestjs/cqrs';
import { PostsService } from '../application/posts.service';
import { PostsQueryParamsDto } from './dto/posts-query-params.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IFullPostOutputModel } from './dto/posts-output-models.dto';
import { getFullPostOutputModel } from '../mappers/posts-mapper';
import { LikesService } from '../../likes/application/likes.service';
import { BlogAllFullPostsOutputModel } from '../../blogs/api/dto/blogs-output-models.dto';
import { CommentsService } from '../../comments/application/comments.service';
import { CommentsQueryParamsDto } from '../../comments/api/dto/comments-query-params.dto';
import {
  AllCommentsOutputModel,
  IFullCommentOutputModel,
} from '../../comments/api/dto/comments-output-models.dto';
import { getFullCommentOutputModel } from '../../comments/mappers/comments-mapper';
import { checkParamIdPipe } from '../../common/pipes/check-param-id-pipe.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { UserDocument } from '../../users/schemas/user.schema';
import { LikeStatusDto } from '../../likes/dto/like-status.dto';
import { AddUserToRequestGuard } from '../../common/guards/add-user-to-request.guard';
import { CreateCommentForPostDto } from './dto/create-comment-for-post.dto';
import { CreatePostCommand } from '../application/use-cases/create-post.useCase';
import { QueryPostsRepository } from '../infrastructure/query-posts.repository';
import { DeletePostCommand } from '../application/use-cases/delete-post.useCase';
import { UpdatePostCommand } from '../application/use-cases/update-post.useCase';
import { QueryLikesRepository } from '../../likes/infrastructure/query-likes.repository';
import { UpdatePostLikeStatusCommand } from '../application/use-cases/update-post-like-status.useCase';
import { QueryCommentsRepository } from '../../comments/infrastructure/query-comments.repository';
import { CreateCommentCommand } from '../../comments/application/use-cases/create-comment.useCase';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private queryPostsRepository: QueryPostsRepository,
    private likesService: LikesService,
    private queryLikesRepository: QueryLikesRepository,
    private commentsService: CommentsService,
    private queryCommentsRepository: QueryCommentsRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(AddUserToRequestGuard)
  async findAllPosts(
    @Query() queryParams: PostsQueryParamsDto,
    @User('_id') userId: string,
  ): Promise<BlogAllFullPostsOutputModel> {
    userId = userId ? String(userId) : null;
    const postsOutputModel = await this.queryPostsRepository.findAllPosts(
      queryParams,
    );
    const posts = postsOutputModel.items;
    const fullPosts = [];

    for (let i = 0; i < posts.length; i++) {
      fullPosts.push(
        await getFullPostOutputModel(
          posts[i],
          this.queryLikesRepository,
          userId,
        ),
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
    @Param('postId', checkParamIdPipe) postId: string,
    @Query() queryParams: CommentsQueryParamsDto,
    @User('_id') userId: string,
  ): Promise<AllCommentsOutputModel> {
    userId = userId ? String(userId) : null;
    const commentsOutputModel =
      await this.queryCommentsRepository.findAllComments(queryParams, postId);
    const comments = commentsOutputModel.items;
    const fullComments = [];

    for (let i = 0; i < comments.length; i++) {
      fullComments.push(
        await getFullCommentOutputModel(
          comments[i],
          this.queryLikesRepository,
          userId,
        ),
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
    @Param('id', checkParamIdPipe) postId: string,
    @User('_id') userId: string,
  ): Promise<IFullPostOutputModel> {
    userId = userId ? String(userId) : null;
    const postOutputModel = await this.queryPostsRepository.findPostById(
      postId,
    );

    return getFullPostOutputModel(
      postOutputModel,
      this.queryLikesRepository,
      userId,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @User('_id') userId: string,
  ): Promise<IFullPostOutputModel> {
    const createdPostId = await this.commandBus.execute(
      new CreatePostCommand(createPostDto),
    );
    const postOutputModel = await this.queryPostsRepository.findPostById(
      createdPostId,
    );

    return getFullPostOutputModel(
      postOutputModel,
      this.queryLikesRepository,
      userId,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async deletePost(
    @Param('id', checkParamIdPipe) postId: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeletePostCommand(postId));
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async updatePost(
    @Param('id', checkParamIdPipe) postId: string,
    @Body() body: UpdatePostDto,
  ): Promise<void> {
    return this.commandBus.execute(new UpdatePostCommand(postId, body));
  }

  @Post(':postId/comments')
  @UseGuards(AuthGuard)
  async createCommentForPost(
    @Param('postId', checkParamIdPipe) postId: string,
    @Body() createCommentForPostDto: CreateCommentForPostDto,
    @User() user: UserDocument,
  ): Promise<IFullCommentOutputModel> {
    const createdCommentId = await this.commandBus.execute(
      new CreateCommentCommand({
        postId,
        content: createCommentForPostDto.content,
        userId: user.id,
        userLogin: user.login,
      }),
    );
    const commentOutputModel =
      await this.queryCommentsRepository.findCommentById(createdCommentId);

    return getFullCommentOutputModel(
      commentOutputModel,
      this.queryLikesRepository,
      String(user._id),
    );
  }

  @Put(':postId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async updatePostLikeStatus(
    @Param('postId', checkParamIdPipe) postId: string,
    @Body() likeStatusDto: LikeStatusDto,
    @User() user: UserDocument,
  ): Promise<void> {
    const { likeStatus } = likeStatusDto;
    await this.commandBus.execute(
      new UpdatePostLikeStatusCommand(user, postId, likeStatus),
    );
  }
}
