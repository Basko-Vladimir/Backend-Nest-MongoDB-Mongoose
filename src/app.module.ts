import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, userSchema } from './users/schemas/user.schema';
import { Blog, blogSchema } from './blogs/schemas/blog.schema';
import { Post, postSchema } from './posts/schemas/post.schema';
import { Like, likeSchema } from './likes/schemas/like.schema';
import { Comment, commentSchema } from './comments/schemas/comment.schema';
import { BlogsController } from './blogs/api/blogs.controller';
import { PostsController } from './posts/api/posts.controller';
import { AdminUsersController } from './users/api/admin-users.controller';
import { UsersService } from './users/application/users.service';
import { BlogsService } from './blogs/application/blogs.service';
import { PostsService } from './posts/application/posts.service';
import { LikesService } from './likes/application/likes.service';
import { UsersRepository } from './users/infrastructure/users.repository';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { LikesRepository } from './likes/infrastructure/likes.repository';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsService } from './comments/application/comments.service';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { JwtService } from './auth/infrastructure/jwt.service';
import { AuthService } from './auth/application/auth.service';
import { AuthController } from './auth/api/auth.controller';
import { EmailManager } from './common/managers/email.manager';
import { EmailAdapter } from './common/adapters/email.adapter';
import { IsExistEntityValidator } from './common/validators/is-exist-entity.validator';
import { DevicesSessionsController } from './devices-sessions/api/devices-sessions.controller';
import { DevicesSessionsService } from './devices-sessions/application/devices-sessions.service';
import { DevicesSessionsRepository } from './devices-sessions/infrastructure/devices-sessions.repository';
import {
  DeviceSession,
  deviceSessionSchema,
} from './devices-sessions/schemas/device-session.schema';
import { ClientsRequestsRepository } from './clients-requests/infrastructure/clients-requests.repository';
import { ClientsRequestsService } from './clients-requests/application/clients-requests.service';
import {
  ClientRequest,
  clientRequestSchema,
} from './clients-requests/schemas/client-request.schema';
import { CreateBlogUseCase } from './blogs/application/use-cases/create-blog.useCase';
import { DeleteBlogUseCase } from './blogs/application/use-cases/delete-blog.useCase';
import { UpdateBlogUseCase } from './blogs/application/use-cases/update-blog.useCase';
import { QueryBlogsRepository } from './blogs/infrastructure/query-blogs.repository';
import { RegisterUserUseCase } from './auth/application/use-cases/register-user.useCase';
import { ResendRegistrationEmailUseCase } from './auth/application/use-cases/resend-registration-email.useCase';
import { LoginUserUseCase } from './auth/application/use-cases/login-user.useCase';
import { RecoverPasswordUseCase } from './auth/application/use-cases/recover-password.useCase';
import { ChangePasswordUseCase } from './auth/application/use-cases/change-password.useCase';
import { RefreshTokensUseCase } from './auth/application/use-cases/refresh-tokens.useCase';
import { LogoutUseCase } from './auth/application/use-cases/logout.useCase';
import { CreateUserUseCase } from './users/application/use-cases/create-user.useCase';
import { DeleteUserUseCase } from './users/application/use-cases/delete-user.useCase';
import { QueryAdminUsersRepository } from './users/infrastructure/query-admin-users-repository.service';
import { CreatePostUseCase } from './posts/application/use-cases/create-post.useCase';
import { QueryPostsRepository } from './posts/infrastructure/query-posts.repository';
import { DeletePostUseCase } from './posts/application/use-cases/delete-post.useCase';
import { UpdatePostUseCase } from './posts/application/use-cases/update-post.useCase';
import { QueryLikesRepository } from './likes/infrastructure/query-likes.repository';
import { CreateLikeUseCase } from './likes/application/use-cases/create-like.useCase';
import { UpdateLikeUseCase } from './likes/application/use-cases/update-like.useCase';
import { UpdatePostLikeStatusUseCase } from './posts/application/use-cases/update-post-like-status.useCase';
import { QueryDevicesSessionsRepository } from './devices-sessions/infrastructure/query-devices-sessions.repository';
import { CreateDeviceSessionUseCase } from './devices-sessions/application/use-cases/create-device-session.useCase';
import { DeleteAllDevicesSessionsExceptCurrentUseCase } from './devices-sessions/application/use-cases/delete-all-devices-sessions-except-current.useCase';
import { DeleteDeviceSessionUseCase } from './devices-sessions/application/use-cases/delete-device-session.useCase';
import { UpdateDeviceSessionUseCase } from './devices-sessions/application/use-cases/update-device-session.useCase';
import { CreateClientRequestUseCase } from './clients-requests/application/use-cases/create-client-request.useCase';
import { UpdateClientRequestUseCase } from './clients-requests/application/use-cases/update-client-request.useCase';
import { UpdateManyClientsRequestsUseCase } from './clients-requests/application/use-cases/update-many-clients-requests.useCase';
import { QueryCommentsRepository } from './comments/infrastructure/query-comments.repository';
import { CreateCommentUseCase } from './comments/application/use-cases/create-comment.useCase';
import { DeleteCommentUseCase } from './comments/application/use-cases/delete-comment.useCase';
import { UpdateCommentUseCase } from './comments/application/use-cases/update-comment.useCase';
import { UpdateCommentLikeStatusUseCase } from './comments/application/use-cases/update-comment-like-status.useCase';
import { GetFullPostUseCase } from './posts/application/use-cases/get-full-post.useCase';
import { GetAllFullPostsUseCase } from './posts/application/use-cases/get-all-full-posts.useCase';
import { GetFullCommentUseCase } from './comments/application/use-cases/get-full-comment.useCase';
import { GetAllFullCommentsUseCase } from './comments/application/use-cases/get-all-full-comments.useCase';
import { UpdateUserBanStatusUseCase } from './users/application/use-cases/update-user-ban-status.useCase';
import { AdminBlogsController } from './blogs/api/admin-blogs.controller';
import { BindBlogWithUserUseCase } from './blogs/application/use-cases/bind-blog-with-user.useCase';
import { BloggerBlogsController } from './blogs/api/blogger-blogs.controller';
import { BloggerUsersController } from './users/api/blogger-users.controller';
import { UpdateUserBanStatusForBlogUseCase } from './users/application/use-cases/update-user-ban-status-for-blog.useCase';
import { QueryBloggerUsersRepositoryService } from './users/infrastructure/query-blogger-users-repository.service';
import { QueryAdminBlogsRepository } from './blogs/infrastructure/query-admin-blogs.repository';
import { QueryBloggerBlogsRepository } from './blogs/infrastructure/query-blogger-blogs.repository';
import { GetAllBloggerCommentsUseCase } from './comments/application/use-cases/get-all-blogger-comments.useCase';

const useCases = [
  CreateBlogUseCase,
  DeleteBlogUseCase,
  UpdateBlogUseCase,
  RegisterUserUseCase,
  ResendRegistrationEmailUseCase,
  LoginUserUseCase,
  RecoverPasswordUseCase,
  ChangePasswordUseCase,
  RefreshTokensUseCase,
  LogoutUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  CreatePostUseCase,
  DeletePostUseCase,
  UpdatePostUseCase,
  UpdatePostLikeStatusUseCase,
  GetFullPostUseCase,
  GetAllFullPostsUseCase,
  CreateLikeUseCase,
  UpdateLikeUseCase,
  CreateDeviceSessionUseCase,
  DeleteAllDevicesSessionsExceptCurrentUseCase,
  DeleteDeviceSessionUseCase,
  UpdateDeviceSessionUseCase,
  CreateClientRequestUseCase,
  UpdateClientRequestUseCase,
  UpdateManyClientsRequestsUseCase,
  CreateCommentUseCase,
  DeleteCommentUseCase,
  UpdateCommentUseCase,
  UpdateCommentLikeStatusUseCase,
  GetFullCommentUseCase,
  GetAllFullCommentsUseCase,
  GetAllBloggerCommentsUseCase,
  UpdateUserBanStatusUseCase,
  UpdateUserBanStatusForBlogUseCase,
  BindBlogWithUserUseCase,
];

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: blogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: postSchema }]),
    MongooseModule.forFeature([{ name: Like.name, schema: likeSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: commentSchema }]),
    MongooseModule.forFeature([
      { name: DeviceSession.name, schema: deviceSessionSchema },
    ]),
    MongooseModule.forFeature([
      { name: ClientRequest.name, schema: clientRequestSchema },
    ]),
    CqrsModule,
  ],
  controllers: [
    AppController,
    AdminUsersController,
    BloggerUsersController,
    BlogsController,
    AdminBlogsController,
    BloggerBlogsController,
    PostsController,
    CommentsController,
    AuthController,
    DevicesSessionsController,
  ],
  providers: [
    AppService,
    UsersService,
    UsersRepository,
    QueryAdminUsersRepository,
    QueryBloggerUsersRepositoryService,
    BlogsService,
    BlogsRepository,
    QueryBlogsRepository,
    QueryAdminBlogsRepository,
    QueryBloggerBlogsRepository,
    PostsService,
    PostsRepository,
    QueryPostsRepository,
    LikesService,
    LikesRepository,
    QueryLikesRepository,
    CommentsService,
    CommentsRepository,
    QueryCommentsRepository,
    AuthService,
    JwtService,
    DevicesSessionsService,
    DevicesSessionsRepository,
    QueryDevicesSessionsRepository,
    ClientsRequestsService,
    ClientsRequestsRepository,
    EmailManager,
    EmailAdapter,
    IsExistEntityValidator,
    ...useCases,
  ],
})
export class AppModule {}
